import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
from services.db import get_ledger_for_product, get_product_by_id
from datetime import datetime, timedelta

def forecast_demand(product_id: int, horizon_days: int = 30):
    product = get_product_by_id(product_id)
    if not product:
        raise ValueError(f"Product with ID {product_id} not found.")

    # Get last 90 days of ledger data
    df = get_ledger_for_product(product_id, days=90)
    
    if df.empty:
        # No history
        return {
            "product_id": product_id,
            "product_name": product['Name'],
            "sku": product['SKU'],
            "history": [],
            "forecast": [],
            "reorder_suggestion": None
        }

    # TransactionType: DELIVERY=1, TRANSFER_OUT=3
    # Compute daily outflow using absolute value of QuantityChange
    outflow_types = [1, 3] 
    outflows = df[df['TransactionType'].isin(outflow_types)].copy()
    outflows['QuantityChange'] = outflows['QuantityChange'].abs()
    
    if outflows.empty:
        return {
            "product_id": product_id,
            "product_name": product['Name'],
            "sku": product['SKU'],
            "history": [],
            "forecast": [{"date": (datetime.now() + timedelta(days=i+1)).strftime('%Y-%m-%d'), "predicted_demand": 0} for i in range(horizon_days)],
            "reorder_suggestion": None
        }

    # Group by date
    outflows['Date'] = pd.to_datetime(outflows['CreatedAt']).dt.date
    daily_outflow = outflows.groupby('Date')['QuantityChange'].sum().reset_index()
    daily_outflow['Date'] = pd.to_datetime(daily_outflow['Date'])
    
    # Create complete date range
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=90)
    all_dates = pd.date_range(start=start_date, end=end_date, freq='D')
    
    daily_outflow.set_index('Date', inplace=True)
    daily_outflow = daily_outflow.reindex(all_dates, fill_value=0)
    
    history_data = [
        {"date": date.strftime('%Y-%m-%d'), "demand": val} 
        for date, val in zip(daily_outflow.index, daily_outflow['QuantityChange'])
    ]
    
    ts = daily_outflow['QuantityChange']
    
    forecast_values = []
    confidence_band = 0
    if len(ts[ts > 0]) >= 14:
        # Use Simple Exponential Smoothing
        model = SimpleExpSmoothing(ts, initialization_method="estimated").fit()
        forecast = model.forecast(horizon_days)
        residuals = model.resid
        confidence_band = 1.5 * np.std(residuals)
        
        forecast_values = forecast.values
    else:
        # Fallback to rolling mean
        mean_demand = ts.mean()
        forecast_values = [mean_demand] * horizon_days
        confidence_band = 1.5 * ts.std() if not pd.isna(ts.std()) else 0

    forecast_values = np.maximum(0, forecast_values) # No negative demand
    
    forecast_results = []
    for i in range(horizon_days):
        forecast_date = datetime.now().date() + timedelta(days=i+1)
        forecast_results.append({
            "date": forecast_date.strftime('%Y-%m-%d'),
            "predicted_demand": round(float(forecast_values[i]), 2),
            "lower_bound": round(max(0, float(forecast_values[i] - confidence_band)), 2),
            "upper_bound": round(float(forecast_values[i] + confidence_band), 2)
        })

    # Find current stock
    # For simplicity, using the latest QuantityAfter from the ledger as an approximation for current stock
    # Note: true stock is in Inventories, but if not provided, this is a fallback.
    current_stock = 0
    if not df.empty:
        current_stock = df.iloc[-1]['QuantityAfter']

    reorder_suggestion = None
    cumulative_demand = 0
    reorder_level = product['ReorderLevel'] or 0

    for idx, f in enumerate(forecast_results):
        cumulative_demand += f['predicted_demand']
        if current_stock - cumulative_demand <= reorder_level:
            reorder_suggestion = {
                "suggested_date": f['date'],
                "reason": f"Expected stock to reach reorder level ({reorder_level}) by {f['date']}.",
                "suggested_quantity": max(0, round(cumulative_demand))
            }
            break

    return {
        "product_id": product_id,
        "product_name": product['Name'],
        "sku": product['SKU'],
        "history": history_data,
        "forecast": forecast_results,
        "reorder_suggestion": reorder_suggestion
    }

import pandas as pd
import numpy as np
from services.db import get_all_recent_ledger
from datetime import datetime

def detect_anomalies(days: int = 30):
    df = get_all_recent_ledger(days)
    if df.empty:
        return {
            "anomalies": [],
            "total_count": 0,
            "scanned_at": datetime.now().isoformat()
        }
        
    anomalies = []
    
    # 1. Zero-stock events
    zero_stock_events = df[df['QuantityAfter'] == 0]
    for _, row in zero_stock_events.iterrows():
        anomalies.append({
            "ledger_id": row['Id'],
            "product_id": row['ProductId'],
            "transaction_type": row['TransactionType'],
            "date": row['CreatedAt'].isoformat(),
            "description": "Stock reached zero",
            "severity": "High",
            "z_score": 0.0
        })

    # Group by ProductId and TransactionType for statistical anomalies
    grouped = df.groupby(['ProductId', 'TransactionType'])
    
    for (prod_id, t_type), group in grouped:
        if len(group) < 5:
            continue
            
        group = group.copy()
        group['AbsQuantityChange'] = group['QuantityChange'].abs()
        mean = group['AbsQuantityChange'].mean()
        std = group['AbsQuantityChange'].std()
        
        if pd.isna(std) or std == 0:
            continue
            
        group['z_score'] = (group['AbsQuantityChange'] - mean) / std
        
        # Flag anomalies with Z-score > 2.0
        flagged = group[group['z_score'] > 2.0]
        
        for _, row in flagged.iterrows():
            z = row['z_score']
            severity = "High" if z > 3.5 else "Medium" if z > 2.5 else "Low"
            
            anomalies.append({
                "ledger_id": row['Id'],
                "product_id": row['ProductId'],
                "transaction_type": row['TransactionType'],
                "date": row['CreatedAt'].isoformat(),
                "description": f"Unusually large transaction volume (Z-score: {z:.2f})",
                "severity": severity,
                "z_score": float(z)
            })

    # Sort anomalies by severity and z_score
    severity_rank = {"High": 3, "Medium": 2, "Low": 1}
    anomalies.sort(key=lambda x: (severity_rank.get(x['severity'], 0), x['z_score']), reverse=True)
    
    return {
        "anomalies": anomalies,
        "total_count": len(anomalies),
        "scanned_at": datetime.now().isoformat()
    }

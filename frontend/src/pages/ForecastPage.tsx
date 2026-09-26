import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';
import { DemandForecast, Product } from '../types';

export const ForecastPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [forecastData, setForecastData] = useState<DemandForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch products for dropdown
    api.get('/products')
      .then(res => {
        const productList = Array.isArray(res.data?.data) ? res.data.data : res.data;
        if (Array.isArray(productList)) {
          setProducts(productList);
        } else if (productList && Array.isArray(productList.items)) {
          setProducts(productList.items);
        }
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
      });
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;

    setLoading(true);
    setError(null);
    api.get(`/ai/forecast/${selectedProductId}?horizonDays=30`)
      .then(res => {
        setForecastData(res.data?.data || res.data);
      })
      .catch(err => {
        setError(err.message || 'Failed to load forecast data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedProductId]);

  const chartData = forecastData ? [
    ...forecastData.history.map(pt => ({
      date: pt.date,
      value: pt.value,
      forecastValue: null,
      lowerBound: null,
      upperBound: null,
      range: null
    })),
    ...forecastData.forecast.map(pt => ({
      date: pt.date,
      value: null,
      forecastValue: pt.forecastValue,
      lowerBound: pt.lowerBound,
      upperBound: pt.upperBound,
      range: [pt.lowerBound, pt.upperBound]
    }))
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Demand Forecast</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Product for Forecast</label>
          <select
            className="w-full md:w-1/3 p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">-- Select Product --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        {!loading && !error && forecastData && (
          <div className="space-y-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="range" fill="#fef08a" stroke="none" name="Confidence Band" opacity={0.5} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Historical Data" />
                  <Line type="monotone" dataKey="forecastValue" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Forecast" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {forecastData.reorderSuggestion && (
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">AI Reorder Suggestion</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                    <p className="text-sm text-slate-500 mb-1">Suggested Date</p>
                    <p className="text-xl font-bold text-indigo-700">{forecastData.reorderSuggestion.suggestedReorderDate}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                    <p className="text-sm text-slate-500 mb-1">Suggested Quantity</p>
                    <p className="text-xl font-bold text-indigo-700">{forecastData.reorderSuggestion.suggestedReorderQuantity}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                    <p className="text-sm text-slate-500 mb-1">Reasoning</p>
                    <p className="text-sm text-slate-700">{forecastData.reorderSuggestion.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

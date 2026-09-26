import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AiAnomalyResult } from '../types';
import { AlertCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';

export const AnomaliesPage: React.FC = () => {
  const [data, setData] = useState<AiAnomalyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const fetchAnomalies = () => {
    setLoading(true);
    setError(null);
    api.get('/ai/anomalies?days=30')
      .then(res => {
        setData(res.data?.data || res.data);
      })
      .catch(err => {
        setError(err.message || 'Failed to load anomalies');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-sky-100 text-sky-700 border-sky-200';
    }
  };

  const highCount = data?.anomalies.filter(a => a.severity === 'High').length || 0;
  const medCount = data?.anomalies.filter(a => a.severity === 'Medium').length || 0;
  const lowCount = data?.anomalies.filter(a => a.severity === 'Low').length || 0;

  const filteredAnomalies = data?.anomalies.filter(a => filter === 'All' || a.severity === filter) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Anomaly Detection</h1>
        <button
          onClick={fetchAnomalies}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium">Total Anomalies</p>
          <p className="text-3xl font-bold text-slate-800">{data?.totalCount || 0}</p>
        </div>
        <div className="bg-rose-50 p-5 rounded-xl shadow-sm border border-rose-100 flex flex-col justify-center">
          <p className="text-sm text-rose-600 font-medium">High Severity</p>
          <p className="text-3xl font-bold text-rose-700">{highCount}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-100 flex flex-col justify-center">
          <p className="text-sm text-amber-600 font-medium">Medium Severity</p>
          <p className="text-3xl font-bold text-amber-700">{medCount}</p>
        </div>
        <div className="bg-sky-50 p-5 rounded-xl shadow-sm border border-sky-100 flex flex-col justify-center">
          <p className="text-sm text-sky-600 font-medium">Low Severity</p>
          <p className="text-3xl font-bold text-sky-700">{lowCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Detected Anomalies</h2>
          <select
            className="p-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="All">All Severities</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>
        </div>

        {error ? (
          <div className="p-8 text-center text-rose-500">{error}</div>
        ) : loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredAnomalies.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No anomalies found. Everything looks normal!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium border-b border-slate-200">Severity</th>
                  <th className="p-4 font-medium border-b border-slate-200">Product</th>
                  <th className="p-4 font-medium border-b border-slate-200">Type</th>
                  <th className="p-4 font-medium border-b border-slate-200">Description</th>
                  <th className="p-4 font-medium border-b border-slate-200">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAnomalies.map((anomaly, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getSeverityClass(anomaly.severity)}`}>
                        {getSeverityIcon(anomaly.severity)}
                        {anomaly.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{anomaly.productName}</div>
                      <div className="text-xs text-slate-500">SKU: {anomaly.sku}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200">
                        {anomaly.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 max-w-md">
                      {anomaly.description}
                      <div className="mt-1 text-xs text-slate-400">
                        Change: {anomaly.quantityChange} | Z-Score: {anomaly.zScore.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(anomaly.detectedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FileBarChart2, Boxes, History, Truck, ArrowUpRight, TrendingDown, Download, FileText, Table } from 'lucide-react';
import { downloadReport } from '../services/api';

const REPORTS = [
  { id: 'inventory', title: 'Inventory Valuation', icon: <Boxes className="w-6 h-6" />, desc: 'Current stock levels and valuation by category' },
  { id: 'ledger', title: 'Stock Ledger', icon: <History className="w-6 h-6" />, desc: 'Detailed transaction history across all warehouses' },
  { id: 'receipts', title: 'Receipts Report', icon: <Truck className="w-6 h-6" />, desc: 'Inbound stock receipts from suppliers' },
  { id: 'deliveries', title: 'Deliveries Report', icon: <ArrowUpRight className="w-6 h-6" />, desc: 'Outbound deliveries to customers' },
  { id: 'low-stock', title: 'Low Stock Alerts', icon: <TrendingDown className="w-6 h-6" />, desc: 'Products currently below reorder levels' },
  { id: 'summary', title: 'Monthly Summary', icon: <FileBarChart2 className="w-6 h-6" />, desc: 'Aggregated operations summary by month' }
];

export const ReportsPage: React.FC = () => {
  const [selected, setSelected] = useState(REPORTS[0]);
  const [format, setFormat] = useState<'pdf'|'excel'>('pdf');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', warehouseId: '' });

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await downloadReport(selected.id, filters, format);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stocksense-${selected.id}-${Date.now()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileBarChart2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map(r => (
          <div 
            key={r.id} 
            onClick={() => setSelected(r)}
            className={`cursor-pointer p-6 rounded-xl border ${selected.id === r.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'} shadow-sm transition-all`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${selected.id === r.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {r.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{r.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
          Configure Report: <span className="text-indigo-600 dark:text-indigo-400">{selected.title}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
            <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Date</label>
            <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Format</label>
            <div className="flex gap-2">
              <button onClick={() => setFormat('pdf')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${format === 'pdf' ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}>
                <FileText className="w-4 h-4" /> PDF
              </button>
              <button onClick={() => setFormat('excel')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${format === 'excel' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}>
                <Table className="w-4 h-4" /> Excel
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDownload}
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <span className="animate-spin text-xl">↻</span> : <Download className="w-5 h-5" />}
          {loading ? 'Generating...' : 'Generate & Download'}
        </button>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { DashboardSummary } from '../types';
import { KpiCard } from '../components/KpiCard';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/CommonState';
import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Plus,
  History,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/summary');
      setData(res.data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner message="Aggregating real-time stock telemetry..." />;
  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
        <p className="font-semibold">Dashboard Load Error</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchSummary}
          className="mt-3 px-4 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Actions</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/products/new')}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => navigate('/receipts/new')}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Receive Stock</span>
          </button>
          <button
            onClick={() => navigate('/deliveries/new')}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Create Delivery</span>
          </button>
          <button
            onClick={() => navigate('/transfers/new')}
            className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Transfer Stock</span>
          </button>
          <button
            onClick={() => navigate('/adjustments/new')}
            className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Stock Adjustment</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Products"
          value={data?.totalProducts || 0}
          icon={Package}
          color="indigo"
          description="Active SKUs in catalog"
        />
        <KpiCard
          title="Total Stock Quantity"
          value={data?.totalStockQuantity.toLocaleString() || 0}
          icon={Boxes}
          color="blue"
          description="Units across all warehouses"
        />
        <KpiCard
          title="Low Stock Alert"
          value={data?.lowStockCount || 0}
          icon={AlertTriangle}
          color="amber"
          description="Items below reorder threshold"
        />
        <KpiCard
          title="Out of Stock"
          value={data?.outOfStockCount || 0}
          icon={XCircle}
          color="rose"
          description="Immediate replenishment needed"
        />
      </div>

      {/* SECONDARY KPI ROW: Pending Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Pending Receipts"
          value={data?.pendingReceipts || 0}
          icon={ArrowDownLeft}
          color="green"
          description="Awaiting validation intake"
        />
        <KpiCard
          title="Pending Deliveries"
          value={data?.pendingDeliveries || 0}
          icon={ArrowUpRight}
          color="purple"
          description="Draft or pending shipments"
        />
        <KpiCard
          title="Pending Transfers"
          value={data?.pendingTransfers || 0}
          icon={ArrowLeftRight}
          color="slate"
          description="Inter-warehouse in transit"
        />
      </div>

      {/* CHART: Stock Movement History */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Stock Movement Telemetry</h3>
            <p className="text-xs text-slate-500">7-Day historical activity breakdown by transaction type</p>
          </div>
        </div>
        <div className="h-72 w-full">
          {data?.stockMovementHistory && data.stockMovementHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.stockMovementHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="receipts" name="Receipts (+)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="deliveries" name="Deliveries (-)" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="transfers" name="Transfers (In/Out)" stroke="#0284c7" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="adjustments" name="Adjustments" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No historical movement data recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* TWO COLUMN GRID: Low Stock Alert Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Low & Out of Stock Products</h3>
            </div>
            <Link to="/inventory" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Total Stock</th>
                  <th className="p-3">Reorder Level</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
                  data.lowStockProducts.map((p) => (
                    <tr key={p.productId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{p.productName}</td>
                      <td className="p-3 text-slate-500 font-mono">{p.sku}</td>
                      <td className="p-3 font-bold text-slate-900">{p.totalStock}</td>
                      <td className="p-3 text-slate-500">{p.reorderLevel}</td>
                      <td className="p-3">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      All products maintain healthy stock levels above reorder thresholds!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Stock Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">Recent Stock Activity</h3>
            </div>
            <Link to="/ledger" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
              <span>Full Audit Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3">Date</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Change</th>
                  <th className="p-3">Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentStockMovements && data.recentStockMovements.length > 0 ? (
                  data.recentStockMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 truncate max-w-[140px]" title={m.productName}>
                        {m.productName}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={m.transactionType} />
                      </td>
                      <td className={`p-3 font-bold ${m.quantityChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                      </td>
                      <td className="p-3 text-slate-500 font-mono truncate max-w-[120px]" title={m.referenceId}>
                        {m.referenceId}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No stock movement ledger records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

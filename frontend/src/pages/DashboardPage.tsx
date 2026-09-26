import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { DashboardSummary, Receipt, DeliveryOrder, InternalTransfer, StockAdjustment, Warehouse, Category, OperationStatus } from '../types';
import { KpiCard } from '../components/KpiCard';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/CommonState';
import {
  Package,
  Boxes,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Plus,
  History,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  Search
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

interface UnifiedOperation {
  id: number;
  type: 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment';
  referenceNumber: string;
  warehouseName: string;
  destinationWarehouse?: string;
  status: OperationStatus;
  itemCount: number;
  totalQuantity: number;
  createdAt: string;
  url: string;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Operations data for dynamic filtering
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [transfers, setTransfers] = useState<InternalTransfer[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [, setCategories] = useState<Category[]>([]);

  // Dynamic Filters (As specified in Problem Statement)
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [opSearch, setOpSearch] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, rRes, dRes, tRes, aRes, wRes, cRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/receipts').catch(() => ({ data: { data: [] } })),
        api.get('/deliveries').catch(() => ({ data: { data: [] } })),
        api.get('/transfers').catch(() => ({ data: { data: [] } })),
        api.get('/adjustments').catch(() => ({ data: { data: [] } })),
        api.get('/warehouses').catch(() => ({ data: { data: [] } })),
        api.get('/categories').catch(() => ({ data: { data: [] } }))
      ]);

      setData(sumRes.data.data);
      setReceipts(rRes.data.data || []);
      setDeliveries(dRes.data.data || []);
      setTransfers(tRes.data.data || []);
      setAdjustments(aRes.data.data || []);
      setWarehouses(wRes.data.data || []);
      setCategories(cRes.data.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Combine all operations into unified list for dynamic multi-criteria filtering
  const allOperations: UnifiedOperation[] = useMemo(() => {
    const list: UnifiedOperation[] = [];

    receipts.forEach((r) => {
      list.push({
        id: r.id,
        type: 'Receipt',
        referenceNumber: r.receiptNumber,
        warehouseName: r.warehouseName,
        status: r.status,
        itemCount: r.items?.length || 0,
        totalQuantity: r.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
        createdAt: r.createdAt,
        url: '/receipts'
      });
    });

    deliveries.forEach((d) => {
      list.push({
        id: d.id,
        type: 'Delivery',
        referenceNumber: d.deliveryNumber,
        warehouseName: d.warehouseName,
        status: d.status,
        itemCount: d.items?.length || 0,
        totalQuantity: d.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
        createdAt: d.createdAt,
        url: '/deliveries'
      });
    });

    transfers.forEach((t) => {
      list.push({
        id: t.id,
        type: 'Transfer',
        referenceNumber: t.transferNumber,
        warehouseName: t.sourceWarehouseName,
        destinationWarehouse: t.destinationWarehouseName,
        status: t.status,
        itemCount: t.items?.length || 0,
        totalQuantity: t.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
        createdAt: t.createdAt,
        url: '/transfers'
      });
    });

    adjustments.forEach((a) => {
      list.push({
        id: a.id,
        type: 'Adjustment',
        referenceNumber: a.adjustmentNumber,
        warehouseName: a.warehouseName,
        status: a.status,
        itemCount: a.items?.length || 0,
        totalQuantity: a.items?.reduce((sum, i) => sum + Math.abs(i.difference), 0) || 0,
        createdAt: a.createdAt,
        url: '/adjustments'
      });
    });

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [receipts, deliveries, transfers, adjustments]);

  // Filter unified operations
  const filteredOperations = useMemo(() => {
    return allOperations.filter((op) => {
      const matchType = docTypeFilter === 'all' || op.type.toLowerCase() === docTypeFilter.toLowerCase();
      
      let matchStatus = true;
      if (statusFilter !== 'all') {
        const targetStatusNum = Number(statusFilter);
        matchStatus = op.status === targetStatusNum;
      }

      const matchWarehouse = warehouseFilter === 'all' || 
        op.warehouseName === warehouseFilter || 
        op.destinationWarehouse === warehouseFilter;

      const matchSearch = opSearch === '' || 
        op.referenceNumber.toLowerCase().includes(opSearch.toLowerCase()) ||
        op.warehouseName.toLowerCase().includes(opSearch.toLowerCase());

      return matchType && matchStatus && matchWarehouse && matchSearch;
    });
  }, [allOperations, docTypeFilter, statusFilter, warehouseFilter, opSearch]);

  if (loading) return <LoadingSpinner message="Aggregating real-time stock telemetry..." />;
  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
        <p className="font-semibold">Dashboard Load Error</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchDashboardData}
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
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Operations</span>
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
            <span>Receive Stock (PO)</span>
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
            <span>Internal Transfer</span>
          </button>
          <button
            onClick={() => navigate('/adjustments/new')}
            className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Physical Count Adjustment</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Products in Stock"
          value={data?.totalProducts || 0}
          icon={Package}
          color="indigo"
          description="Active catalog SKUs tracked"
        />
        <KpiCard
          title="Total Stock Units"
          value={data?.totalStockQuantity.toLocaleString() || 0}
          icon={Boxes}
          color="blue"
          description="Aggregated warehouse inventory"
        />
        <KpiCard
          title="Low Stock / Out of Stock"
          value={(data?.lowStockCount || 0) + (data?.outOfStockCount || 0)}
          icon={AlertTriangle}
          color="amber"
          description={`${data?.lowStockCount || 0} Low · ${data?.outOfStockCount || 0} Critical Out`}
        />
        <KpiCard
          title="Active Warehouses"
          value={warehouses.length || 2}
          icon={Boxes}
          color="green"
          description="Fulfillment locations monitored"
        />
      </div>

      {/* PENDING OPERATIONS KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => { setDocTypeFilter('receipt'); setStatusFilter('1'); }}
          className="p-4 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pending Receipts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{data?.pendingReceipts || 0}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Inbound shipments awaiting validation intake</p>
        </div>

        <div 
          onClick={() => { setDocTypeFilter('delivery'); setStatusFilter('1'); }}
          className="p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-400 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Pending Deliveries</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{data?.pendingDeliveries || 0}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Outbound customer orders to pick, pack & ship</p>
        </div>

        <div 
          onClick={() => { setDocTypeFilter('transfer'); setStatusFilter('1'); }}
          className="p-4 bg-white rounded-xl border border-sky-200 hover:border-sky-400 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Internal Transfers Scheduled</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{data?.pendingTransfers || 0}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Inter-facility transfers scheduled</p>
        </div>
      </div>

      {/* DYNAMIC OPERATIONS FILTER SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Dynamic Operations & Documents Explorer</span>
            </h3>
            <p className="text-xs text-slate-500">Filter all warehouse operations by document type, status, warehouse, and search term</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full self-start md:self-auto">
            {filteredOperations.length} Matching Documents
          </span>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-white">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type:</label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Documents (Receipts, Delivery, Internal, Adjustments)</option>
              <option value="receipt">Receipts (Incoming Stock)</option>
              <option value="delivery">Delivery Orders (Outgoing Stock)</option>
              <option value="transfer">Internal Transfers</option>
              <option value="adjustment">Inventory Adjustments</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="1">Draft</option>
              <option value="2">Waiting</option>
              <option value="3">Ready</option>
              <option value="4">Done</option>
              <option value="5">Canceled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouse:</label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Warehouses / Locations</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference #..."
              value={opSearch}
              onChange={(e) => setOpSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Filtered Operations Table */}
        <div className="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr className="text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-3">Reference #</th>
                <th className="p-3">Document Type</th>
                <th className="p-3">Warehouse / Location</th>
                <th className="p-3">Items / Units</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOperations.length > 0 ? (
                filteredOperations.map((op) => {
                  return (
                    <tr key={`${op.type}-${op.id}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-indigo-600">{op.referenceNumber}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          op.type === 'Receipt' ? 'bg-emerald-50 text-emerald-700' :
                          op.type === 'Delivery' ? 'bg-purple-50 text-purple-700' :
                          op.type === 'Transfer' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {op.type === 'Receipt' && <ArrowDownLeft className="w-3 h-3" />}
                          {op.type === 'Delivery' && <ArrowUpRight className="w-3 h-3" />}
                          {op.type === 'Transfer' && <ArrowLeftRight className="w-3 h-3" />}
                          {op.type === 'Adjustment' && <SlidersHorizontal className="w-3 h-3" />}
                          {op.type}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        {op.destinationWarehouse ? `${op.warehouseName} → ${op.destinationWarehouse}` : op.warehouseName}
                      </td>
                      <td className="p-3 text-slate-600">
                        <span className="font-bold text-slate-900">{op.totalQuantity}</span> units ({op.itemCount} items)
                      </td>
                      <td className="p-3">
                        <StatusBadge status={op.status} />
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {new Date(op.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={op.url}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No operations matched your dynamic filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              <h3 className="text-sm font-bold text-slate-900">Low & Out of Stock Alerts</h3>
            </div>
            <Link to="/reordering-rules" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
              <span>Reorder Rules</span>
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

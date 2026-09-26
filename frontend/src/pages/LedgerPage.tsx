import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { StockLedger, Product, Warehouse, TransactionType } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import { Search, Filter, History } from 'lucide-react';

export const LedgerPage: React.FC = () => {
  const [ledgers, setLedgers] = useState<StockLedger[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | ''>('');
  const [selectedType, setSelectedType] = useState<number | ''>('');

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const [lRes, pRes, wRes] = await Promise.all([
        api.get('/ledger'),
        api.get('/products'),
        api.get('/warehouses')
      ]);
      setLedgers(lRes.data.data);
      setProducts(pRes.data.data);
      setWarehouses(wRes.data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const filtered = ledgers.filter((l) => {
    const matchesSearch =
      l.productName.toLowerCase().includes(search.toLowerCase()) ||
      l.sku.toLowerCase().includes(search.toLowerCase()) ||
      l.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      l.createdBy.toLowerCase().includes(search.toLowerCase());

    const matchesProduct = selectedProduct === '' || l.productId === Number(selectedProduct);
    const matchesWarehouse = selectedWarehouse === '' || l.warehouseId === Number(selectedWarehouse);
    const matchesType = selectedType === '' || l.transactionType === Number(selectedType);

    return matchesSearch && matchesProduct && matchesWarehouse && matchesType;
  });

  if (loading) return <LoadingSpinner message="Loading Stock Ledger audit trail..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-amber-500" />
          <span>Stock Ledger Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-500">Immutable transaction log tracking all stock modifications across the organization</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product, SKU, reference ID, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Product Filter */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[160px]"
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Warehouse Filter */}
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[160px]"
        >
          <option value="">All Warehouses</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        {/* Transaction Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Transaction Types</option>
          <option value={TransactionType.RECEIPT}>RECEIPT (+)</option>
          <option value={TransactionType.DELIVERY}>DELIVERY (-)</option>
          <option value={TransactionType.TRANSFER_IN}>TRANSFER IN (+)</option>
          <option value={TransactionType.TRANSFER_OUT}>TRANSFER OUT (-)</option>
          <option value={TransactionType.ADJUSTMENT}>ADJUSTMENT (+/-)</option>
        </select>
      </div>

      {/* Audit Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Ledger Records Found"
          description="No inventory transaction history matches your search filters."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Warehouse</th>
                  <th className="p-3.5">Transaction Type</th>
                  <th className="p-3.5">Reference ID</th>
                  <th className="p-3.5">Before</th>
                  <th className="p-3.5">Change</th>
                  <th className="p-3.5">After</th>
                  <th className="p-3.5">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString()} {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{l.productName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{l.sku}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{l.warehouseName}</td>
                    <td className="p-3.5">
                      <StatusBadge status={l.transactionType} />
                    </td>
                    <td className="p-3.5 font-mono text-indigo-600 font-semibold">{l.referenceId}</td>
                    <td className="p-3.5 text-slate-500">{l.quantityBefore}</td>
                    <td className={`p-3.5 font-extrabold ${l.quantityChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {l.quantityChange > 0 ? `+${l.quantityChange}` : l.quantityChange}
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">{l.quantityAfter}</td>
                    <td className="p-3.5 text-slate-500 font-medium">{l.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

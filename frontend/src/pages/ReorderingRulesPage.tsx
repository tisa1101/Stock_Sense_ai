import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Product, Category, Warehouse } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import {
  SlidersHorizontal,
  Search,
  Filter,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Edit2,
  Save,
  X,
  Plus
} from 'lucide-react';

export const ReorderingRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Editing state for inline reorder level modification
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLevel, setEditLevel] = useState<number>(0);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, whRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/warehouses')
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
      setWarehouses(whRes.data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditLevel(product.reorderLevel);
  };

  const handleSaveEdit = async (product: Product) => {
    setSavingId(product.id);
    try {
      await api.put(`/products/${product.id}`, {
        name: product.name,
        sku: product.sku,
        categoryId: product.categoryId,
        unitOfMeasure: product.unitOfMeasure,
        reorderLevel: Number(editLevel),
        isActive: product.isActive
      });
      setEditingId(null);
      await fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update reorder rule');
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.categoryId === Number(selectedCategory);

    let matchesStatus = true;
    if (statusFilter === 'low') {
      matchesStatus = p.totalStock <= p.reorderLevel && p.totalStock > 0;
    } else if (statusFilter === 'out') {
      matchesStatus = p.totalStock === 0;
    } else if (statusFilter === 'healthy') {
      matchesStatus = p.totalStock > p.reorderLevel;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = products.filter((p) => p.totalStock <= p.reorderLevel && p.totalStock > 0).length;
  const outOfStockCount = products.filter((p) => p.totalStock === 0).length;
  const healthyCount = products.filter((p) => p.totalStock > p.reorderLevel).length;

  if (loading) return <LoadingSpinner message="Loading automated reordering rules..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            <span>Automated Reordering Rules</span>
          </h1>
          <p className="text-xs text-slate-500">
            Define safety stock thresholds, minimum reorder triggers, and automatic procurement levels per SKU
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/products/new')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New SKU Rule</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter(statusFilter === 'healthy' ? 'all' : 'healthy')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'healthy' ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adequate Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{healthyCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Inventory safely above reorder threshold</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'low' ? 'all' : 'low')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'low' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reorder Triggered</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{lowStockCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Below safety stock — replenishment suggested</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'out' ? 'all' : 'out')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'out' ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Stockouts</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{outOfStockCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Zero units on-hand — urgent PO required</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU or Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === '' ? '' : Number(e.target.value))}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="all">All Reorder Statuses</option>
          <option value="low">Triggered (Low Stock)</option>
          <option value="out">Critical (Out of Stock)</option>
          <option value="healthy">Adequate (Safe)</option>
        </select>
      </div>

      {/* Reordering Rules Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Reordering Rules Found"
          description="Try changing your search parameters or filter criteria."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">Product & SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Min Reorder Level</th>
                  <th className="p-3.5">Deficit / Safety Margin</th>
                  <th className="p-3.5">Reorder Rule Status</th>
                  <th className="p-3.5 text-right">Rule Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const isLow = p.totalStock <= p.reorderLevel;
                  const deficit = p.reorderLevel - p.totalStock;
                  const isEditing = editingId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="font-mono text-slate-500 text-[11px]">{p.sku}</p>
                      </td>
                      <td className="p-3.5 text-slate-600">{p.categoryName}</td>
                      <td className="p-3.5 font-black text-slate-900 text-sm">
                        {p.totalStock} <span className="text-[10px] font-normal text-slate-400">{p.unitOfMeasure}</span>
                      </td>
                      <td className="p-3.5">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              value={editLevel}
                              onChange={(e) => setEditLevel(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 px-2 py-1 bg-white border border-indigo-500 rounded text-xs font-bold focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(p)}
                              disabled={savingId === p.id}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-700">{p.reorderLevel}</span>
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Edit Reorder Threshold"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        {deficit > 0 ? (
                          <span className="font-bold text-rose-600">-{deficit} {p.unitOfMeasure} (Shortage)</span>
                        ) : (
                          <span className="font-medium text-emerald-600">+{Math.abs(deficit)} {p.unitOfMeasure} buffer</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={p.stockStatus} />
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLow && (
                            <button
                              onClick={() => navigate(`/receipts/new?productId=${p.id}&quantity=${Math.max(deficit * 2, p.reorderLevel)}`)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded shadow-2xs flex items-center gap-1 transition-colors"
                              title="Draft Incoming Stock Receipt from Supplier"
                            >
                              <ArrowDownLeft className="w-3 h-3" />
                              <span>Order Restock</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

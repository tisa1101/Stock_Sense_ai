import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { InventoryItem, Category, Warehouse } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import { Search, Filter, Boxes } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [invRes, catRes, whRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/categories'),
        api.get('/warehouses')
      ]);
      setInventories(invRes.data.data);
      setCategories(catRes.data.data);
      setWarehouses(whRes.data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filtered = inventories.filter((i) => {
    const matchesSearch =
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.warehouseName.toLowerCase().includes(search.toLowerCase());

    const matchesWarehouse = selectedWarehouse === '' || i.warehouseId === Number(selectedWarehouse);
    const matchesStatus = selectedStatus === '' || i.status === selectedStatus;
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Querying real-time stock levels..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Stock Overview Matrix</h1>
        <p className="text-xs text-slate-500">Real-time stock quantities across products and warehouses</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product, SKU, or warehouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Warehouse Filter */}
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Warehouses</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.code})
            </option>
          ))}
        </select>

        {/* Stock Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Stock Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Stock Items Found"
          description="No inventory records match your criteria."
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Warehouse</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Reserved</th>
                  <th className="p-3.5">Available</th>
                  <th className="p-3.5">Reorder Level</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.productName}</td>
                    <td className="p-3.5 font-mono text-slate-600 font-semibold">{item.sku}</td>
                    <td className="p-3.5 text-slate-600 font-medium">{item.warehouseName}</td>
                    <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">{item.quantity}</td>
                    <td className="p-3.5 text-slate-500">{item.reservedQuantity}</td>
                    <td className="p-3.5 font-bold text-emerald-600">{item.availableQuantity}</td>
                    <td className="p-3.5 text-slate-500">{item.reorderLevel}</td>
                    <td className="p-3.5">
                      <StatusBadge status={item.status} />
                    </td>
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

import React, { useEffect, useState } from 'react';
import { getSuppliers, getSupplierStats, createSupplier, deleteSupplier } from '../services/api';
import { Plus, Search, Trash2, Edit, Truck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Supplier, SupplierStats } from '../types';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [search, setSearch] = useState('');

  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers(search);
      setSuppliers(res.data?.data?.items || res.data?.data || []);
      const sRes = await getSupplierStats();
      setStats(sRes.data?.data || sRes.data);
    } catch {}
  };

  useEffect(() => { fetchSuppliers(); }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Suppliers
        </h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Suppliers</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats?.totalSuppliers || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{stats?.activeSuppliers || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Receipts This Month</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{stats?.totalReceiptsThisMonth || 0}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{s.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{s.contactPerson}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{s.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (s as any).rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Link to={`/suppliers/${s.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">View</Link>
                    <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

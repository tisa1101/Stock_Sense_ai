import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSupplierById, getSupplierReceipts } from '../services/api';
import { ArrowLeft, Truck, Mail, Phone, MapPin, Star, Package } from 'lucide-react';
import { SupplierDetail, Receipt } from '../types';

export const SupplierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    if (id) {
      getSupplierById(Number(id)).then(res => setSupplier(res.data?.data || res.data));
      getSupplierReceipts(Number(id)).then(res => setReceipts(res.data?.data || res.data));
    }
  }, [id]);

  if (!supplier) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <Link to="/suppliers" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
        <ArrowLeft className="w-4 h-4" /> Back to Suppliers
      </Link>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {supplier.name}
            {supplier.isActive ? (
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">Active</span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full">Inactive</span>
            )}
          </h1>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {supplier.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {supplier.phone}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {supplier.address}</div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-slate-200">Contact:</span> {supplier.contactPerson}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < supplier.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
            ))}
          </div>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors">
            Edit Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Receipts</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{supplier.totalReceipts}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Quantity Supplied</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{supplier.totalQuantitySupplied}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-white">Receipt History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Receipt #</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Warehouse</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {receipts.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{r.receiptNumber}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{new Date(r.receiptDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{r.warehouseName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Status {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {receipts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No receipts found for this supplier.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Product, InventoryItem, StockLedger } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/CommonState';
import { ArrowLeft, Package, Boxes, History } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [ledgers, setLedgers] = useState<StockLedger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [pRes, iRes, lRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/inventory/product/${id}`),
          api.get(`/ledger/product/${id}`)
        ]);
        setProduct(pRes.data.data);
        setInventories(iRes.data.data);
        setLedgers(lRes.data.data);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner message="Fetching product details and stock audit..." />;
  if (!product) return <div className="p-6 text-slate-500">Product not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/products')}
          className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
            <StatusBadge status={product.stockStatus} />
          </div>
          <p className="text-xs text-slate-500 font-mono">SKU: {product.sku} | Category: {product.categoryName}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Physical Stock</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{product.totalStock} {product.unitOfMeasure}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Reorder Level</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{product.reorderLevel} {product.unitOfMeasure}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Created On</p>
          <p className="text-sm font-semibold text-slate-700 mt-2">{new Date(product.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Warehouse Stock Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <div className="flex items-center gap-2 mb-4">
          <Boxes className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Stock Location Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3">Warehouse</th>
                <th className="p-3">Physical Qty</th>
                <th className="p-3">Reserved</th>
                <th className="p-3">Available</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventories.map((i) => (
                <tr key={i.id}>
                  <td className="p-3 font-semibold text-slate-900">{i.warehouseName}</td>
                  <td className="p-3 font-bold text-slate-900">{i.quantity}</td>
                  <td className="p-3 text-slate-500">{i.reservedQuantity}</td>
                  <td className="p-3 font-bold text-emerald-600">{i.availableQuantity}</td>
                  <td className="p-3"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Stock Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Historical Stock Ledger Audit</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3">Date</th>
                <th className="p-3">Warehouse</th>
                <th className="p-3">Type</th>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Before</th>
                <th className="p-3">Change</th>
                <th className="p-3">After</th>
                <th className="p-3">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgers.map((l) => (
                <tr key={l.id}>
                  <td className="p-3 text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-3 font-medium text-slate-900">{l.warehouseName}</td>
                  <td className="p-3"><StatusBadge status={l.transactionType} /></td>
                  <td className="p-3 font-mono text-slate-600">{l.referenceId}</td>
                  <td className="p-3 text-slate-500">{l.quantityBefore}</td>
                  <td className={`p-3 font-bold ${l.quantityChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {l.quantityChange > 0 ? `+${l.quantityChange}` : l.quantityChange}
                  </td>
                  <td className="p-3 font-bold text-slate-900">{l.quantityAfter}</td>
                  <td className="p-3 text-slate-500">{l.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

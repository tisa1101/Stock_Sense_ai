import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Warehouse, Product, InventoryItem } from '../types';
import { ArrowLeft, Save, CheckCircle, Plus, Trash2, AlertCircle } from 'lucide-react';

interface AdjustmentLine {
  productId: number;
  countedQuantity: number;
}

export const CreateAdjustmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<InventoryItem[]>([]);

  const [warehouseId, setWarehouseId] = useState<number | ''>('');
  const [reason, setReason] = useState('Routine physical stock audit');
  const [lines, setLines] = useState<AdjustmentLine[]>([{ productId: 0, countedQuantity: 0 }]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/warehouses'),
      api.get('/products'),
      api.get('/inventory')
    ]).then(([wRes, pRes, iRes]) => {
      setWarehouses(wRes.data.data);
      setProducts(pRes.data.data);
      setInventories(iRes.data.data);
      if (wRes.data.data.length > 0) setWarehouseId(wRes.data.data[0].id);
      if (pRes.data.data.length > 0) {
        const pId = pRes.data.data[0].id;
        const sysQty = iRes.data.data.find((i: InventoryItem) => i.productId === pId && i.warehouseId === wRes.data.data[0].id)?.quantity || 0;
        setLines([{ productId: pId, countedQuantity: sysQty }]);
      }
    });
  }, []);

  const getSystemQuantity = (prodId: number, whId: number | '') => {
    if (!whId || !prodId) return 0;
    const inv = inventories.find((i) => i.productId === prodId && i.warehouseId === Number(whId));
    return inv ? inv.quantity : 0;
  };

  const addLine = () => {
    const firstProd = products[0]?.id || 0;
    const sysQty = getSystemQuantity(firstProd, warehouseId);
    setLines([...lines, { productId: firstProd, countedQuantity: sysQty }]);
  };

  const removeLine = (index: number) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLineProduct = (index: number, pId: number) => {
    const sysQty = getSystemQuantity(pId, warehouseId);
    const copy = [...lines];
    copy[index] = { productId: pId, countedQuantity: sysQty };
    setLines(copy);
  };

  const updateLineCount = (index: number, count: number) => {
    const copy = [...lines];
    copy[index] = { ...copy[index], countedQuantity: count };
    setLines(copy);
  };

  const handleSave = async (autoValidate: boolean) => {
    setError(null);
    if (!warehouseId) {
      setError('Please select a warehouse.');
      return;
    }

    setSubmitting(true);
    try {
      const createRes = await api.post('/adjustments', {
        warehouseId: Number(warehouseId),
        reason,
        items: lines,
      });

      const newAdjId = createRes.data.data.id;
      if (autoValidate) {
        await api.post(`/adjustments/${newAdjId}/validate`);
      }
      navigate('/adjustments');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Adjustment creation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/adjustments')} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">New Stock Adjustment</h1>
          <p className="text-xs text-slate-500">Reconcile system quantities against physical count</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Warehouse *</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Adjustment Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Damaged goods, Stock audit discrepancy"
            />
          </div>
        </div>

        {/* Lines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Adjustment Lines ({lines.length})</h3>
            <button
              type="button"
              onClick={addLine}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          {lines.map((line, idx) => {
            const sysQty = getSystemQuantity(line.productId, warehouseId);
            const diff = line.countedQuantity - sysQty;

            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Product</label>
                  <select
                    value={line.productId}
                    onChange={(e) => updateLineProduct(idx, Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} [{p.sku}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24 text-center">
                  <label className="text-[10px] text-slate-400 block mb-0.5">System Qty</label>
                  <div className="py-1.5 px-2 bg-slate-100 border border-slate-200 rounded text-xs font-bold text-slate-700">
                    {sysQty}
                  </div>
                </div>

                <div className="w-28">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Physical Count</label>
                  <input
                    type="number"
                    value={line.countedQuantity}
                    onChange={(e) => updateLineCount(idx, Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>

                <div className="w-24 text-center">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Difference</label>
                  <div
                    className={`py-1.5 px-2 rounded text-xs font-extrabold border ${
                      diff === 0
                        ? 'bg-slate-50 text-slate-600 border-slate-200'
                        : diff > 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeLine(idx)}
                  disabled={lines.length === 1}
                  className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 mt-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={submitting}
            className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={submitting}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{submitting ? 'Processing...' : 'Validate Adjustment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

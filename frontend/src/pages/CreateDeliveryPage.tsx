import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Warehouse, Product, InventoryItem } from '../types';
import { ArrowLeft, Save, CheckCircle, Plus, Trash2, AlertCircle } from 'lucide-react';

interface DeliveryLine {
  productId: number;
  quantity: number;
}

export const CreateDeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<InventoryItem[]>([]);

  const [warehouseId, setWarehouseId] = useState<number | ''>('');
  const [lines, setLines] = useState<DeliveryLine[]>([{ productId: 0, quantity: 5 }]);

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
      if (pRes.data.data.length > 0) setLines([{ productId: pRes.data.data[0].id, quantity: 5 }]);
    });
  }, []);

  const getAvailableStock = (prodId: number, whId: number | '') => {
    if (!whId || !prodId) return 0;
    const inv = inventories.find((i) => i.productId === prodId && i.warehouseId === Number(whId));
    return inv ? inv.availableQuantity : 0;
  };

  const addLine = () => {
    const firstProd = products[0]?.id || 0;
    setLines([...lines, { productId: firstProd, quantity: 5 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof DeliveryLine, value: number) => {
    const copy = [...lines];
    copy[index] = { ...copy[index], [field]: value };
    setLines(copy);
  };

  const handleSave = async (autoValidate: boolean) => {
    setError(null);
    if (!warehouseId) {
      setError('Please select origin warehouse.');
      return;
    }

    // Check stock availability
    for (const line of lines) {
      const avail = getAvailableStock(line.productId, warehouseId);
      const prodName = products.find((p) => p.id === line.productId)?.name || `Product #${line.productId}`;
      if (line.quantity > avail) {
        setError(`Insufficient stock for ${prodName}. Requested: ${line.quantity}, Available: ${avail}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const createRes = await api.post('/deliveries', {
        warehouseId: Number(warehouseId),
        items: lines,
      });

      const newDeliveryId = createRes.data.data.id;
      if (autoValidate) {
        await api.post(`/deliveries/${newDeliveryId}/validate`);
      }
      navigate('/deliveries');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delivery creation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/deliveries')} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create Stock Delivery</h1>
          <p className="text-xs text-slate-500">Dispatch stock items from warehouse to client</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Dispatch Warehouse *</label>
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

        {/* Lines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Outbound Items ({lines.length})</h3>
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
            const avail = getAvailableStock(line.productId, warehouseId);
            const isOver = line.quantity > avail;

            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <select
                    value={line.productId}
                    onChange={(e) => updateLine(idx, 'productId', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} [{p.sku}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-32">
                  <input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => updateLine(idx, 'quantity', Number(e.target.value))}
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none font-semibold ${
                      isOver ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    placeholder="Quantity"
                  />
                </div>

                <div className="w-32 text-xs font-medium text-right">
                  <span className="text-slate-400">Avail: </span>
                  <span className={avail > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>{avail}</span>
                </div>

                <button
                  type="button"
                  onClick={() => removeLine(idx)}
                  disabled={lines.length === 1}
                  className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30"
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
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{submitting ? 'Processing...' : 'Validate Delivery'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

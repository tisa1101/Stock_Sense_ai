import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Supplier, Warehouse, Product } from '../types';
import { ArrowLeft, Save, CheckCircle, Plus, Trash2, AlertCircle, ScanLine } from 'lucide-react';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';

interface ReceiptLine {
  productId: number;
  quantity: number;
}

export const CreateReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [warehouseId, setWarehouseId] = useState<number | ''>('');
  const [lines, setLines] = useState<ReceiptLine[]>([{ productId: 0, quantity: 10 }]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanActiveIndex, setScanActiveIndex] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/suppliers'),
      api.get('/warehouses'),
      api.get('/products')
    ]).then(([sRes, wRes, pRes]) => {
      setSuppliers(sRes.data.data);
      setWarehouses(wRes.data.data);
      setProducts(pRes.data.data);
      if (sRes.data.data.length > 0) setSupplierId(sRes.data.data[0].id);
      if (wRes.data.data.length > 0) setWarehouseId(wRes.data.data[0].id);
      if (pRes.data.data.length > 0) setLines([{ productId: pRes.data.data[0].id, quantity: 10 }]);
    });
  }, []);

  const handleBarcodeScan = (scannedCode: string) => {
    const code = scannedCode.trim().toLowerCase();
    const matched = products.find(
      (p) => p.sku.toLowerCase() === code || p.name.toLowerCase().includes(code) || p.id.toString() === code
    );

    if (matched) {
      if (scanActiveIndex !== null && scanActiveIndex < lines.length) {
        updateLine(scanActiveIndex, 'productId', matched.id);
      } else {
        // Check if line already has this product
        const existingIdx = lines.findIndex((l) => l.productId === matched.id);
        if (existingIdx >= 0) {
          updateLine(existingIdx, 'quantity', lines[existingIdx].quantity + 1);
        } else if (lines.length === 1 && lines[0].productId === 0) {
          setLines([{ productId: matched.id, quantity: 10 }]);
        } else {
          setLines([...lines, { productId: matched.id, quantity: 10 }]);
        }
      }
      setError(null);
    } else {
      setError(`Scanned code "${scannedCode}" did not match any registered product SKU.`);
    }
    setScanActiveIndex(null);
  };

  const addLine = () => {
    const firstProd = products[0]?.id || 0;
    setLines([...lines, { productId: firstProd, quantity: 10 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof ReceiptLine, value: number) => {
    const copy = [...lines];
    copy[index] = { ...copy[index], [field]: value };
    setLines(copy);
  };

  const handleSave = async (autoValidate: boolean) => {
    setError(null);
    if (!supplierId || !warehouseId) {
      setError('Please select supplier and destination warehouse.');
      return;
    }
    if (lines.some((l) => !l.productId || l.quantity <= 0)) {
      setError('All items must have a selected product and quantity > 0.');
      return;
    }

    setSubmitting(true);
    try {
      const createRes = await api.post('/receipts', {
        supplierId: Number(supplierId),
        warehouseId: Number(warehouseId),
        items: lines,
      });

      const newReceiptId = createRes.data.data.id;
      if (autoValidate) {
        await api.post(`/receipts/${newReceiptId}/validate`);
      }
      navigate('/receipts');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalQuantity = lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/receipts')} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create Stock Receipt</h1>
          <p className="text-xs text-slate-500">Record incoming stock items from supplier</p>
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
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Supplier *</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Destination Warehouse *</label>
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
        </div>

        {/* Product Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Receipt Line Items ({lines.length})</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setScanActiveIndex(null);
                  setIsScannerOpen(true);
                }}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-200"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scan Barcode / QR</span>
              </button>
              <button
                type="button"
                onClick={addLine}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {lines.map((line, idx) => (
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  placeholder="Quantity"
                />
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
          ))}

          <div className="pt-2 text-right">
            <span className="text-xs font-semibold text-slate-500">Total Receipt Units: </span>
            <span className="text-sm font-bold text-slate-900">{totalQuantity}</span>
          </div>
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
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{submitting ? 'Processing...' : 'Validate Receipt'}</span>
          </button>
        </div>
      </div>

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setScanActiveIndex(null);
        }}
        onScan={handleBarcodeScan}
        title="Scan Receipt Item Barcode / QR"
        description="Scan product packaging barcodes to automatically add or select items."
      />
    </div>
  );
};

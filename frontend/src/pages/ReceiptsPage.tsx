import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Receipt, OperationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import { Plus, ArrowDownLeft, CheckCircle } from 'lucide-react';

export const ReceiptsPage: React.FC = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/receipts');
      setReceipts(res.data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleValidate = async (id: number) => {
    if (!window.confirm('Validate this receipt? Inventory will be increased and ledger entries logged.')) return;
    setValidatingId(id);
    try {
      await api.post(`/receipts/${id}/validate`);
      fetchReceipts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Validation failed.');
    } finally {
      setValidatingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching stock receipts..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stock Receipts (Intake)</h1>
          <p className="text-xs text-slate-500">Record incoming inventory shipments from suppliers</p>
        </div>
        <button
          onClick={() => navigate('/receipts/new')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Receipt</span>
        </button>
      </div>

      {receipts.length === 0 ? (
        <EmptyState
          title="No Receipts Found"
          description="Create a new stock receipt to process incoming supplier orders."
          actionLabel="Create Receipt"
          onAction={() => navigate('/receipts/new')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">Receipt Number</th>
                  <th className="p-3.5">Supplier</th>
                  <th className="p-3.5">Warehouse</th>
                  <th className="p-3.5">Items Count</th>
                  <th className="p-3.5">Total Quantity</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((r) => {
                  const totalQty = r.items.reduce((sum, item) => sum + item.quantity, 0);
                  const isDone = r.status === OperationStatus.Done;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-indigo-600 flex items-center gap-2">
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{r.receiptNumber}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-900">{r.supplierName}</td>
                      <td className="p-3.5 text-slate-600">{r.warehouseName}</td>
                      <td className="p-3.5 text-slate-500">{r.items.length} items</td>
                      <td className="p-3.5 font-bold text-slate-900">{totalQty} units</td>
                      <td className="p-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="p-3.5 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        {!isDone && (
                          <button
                            onClick={() => handleValidate(r.id)}
                            disabled={validatingId === r.id}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded shadow-xs flex items-center gap-1.5 ml-auto disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{validatingId === r.id ? 'Validating...' : 'Validate'}</span>
                          </button>
                        )}
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

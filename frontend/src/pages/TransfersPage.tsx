import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { InternalTransfer, OperationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import { Plus, ArrowLeftRight, CheckCircle, ArrowRight } from 'lucide-react';

export const TransfersPage: React.FC = () => {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<InternalTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transfers');
      setTransfers(res.data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleValidate = async (id: number) => {
    if (!window.confirm('Validate this warehouse transfer? Source stock will decrease and destination stock will increase.')) return;
    setValidatingId(id);
    try {
      await api.post(`/transfers/${id}/validate`);
      fetchTransfers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Validation failed.');
    } finally {
      setValidatingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching inter-warehouse transfers..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Internal Transfers</h1>
          <p className="text-xs text-slate-500">Move inventory between warehouses with dual-ledger accounting</p>
        </div>
        <button
          onClick={() => navigate('/transfers/new')}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Transfer</span>
        </button>
      </div>

      {transfers.length === 0 ? (
        <EmptyState
          title="No Transfers Found"
          description="Create a transfer to move stock between warehouses."
          actionLabel="Create Transfer"
          onAction={() => navigate('/transfers/new')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">Transfer Number</th>
                  <th className="p-3.5">Source → Destination</th>
                  <th className="p-3.5">Items Count</th>
                  <th className="p-3.5">Total Quantity</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((t) => {
                  const totalQty = t.items.reduce((sum, item) => sum + item.quantity, 0);
                  const isDone = t.status === OperationStatus.Done;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-indigo-600 flex items-center gap-2">
                        <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
                        <span>{t.transferNumber}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 flex items-center gap-1.5">
                        <span>{t.sourceWarehouseName}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-indigo-600">{t.destinationWarehouseName}</span>
                      </td>
                      <td className="p-3.5 text-slate-500">{t.items.length} items</td>
                      <td className="p-3.5 font-bold text-slate-900">{totalQty} units</td>
                      <td className="p-3.5">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="p-3.5 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        {!isDone && (
                          <button
                            onClick={() => handleValidate(t.id)}
                            disabled={validatingId === t.id}
                            className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded shadow-xs flex items-center gap-1.5 ml-auto disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{validatingId === t.id ? 'Validating...' : 'Validate'}</span>
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

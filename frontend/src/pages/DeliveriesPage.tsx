import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DeliveryOrder, OperationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import { Plus, ArrowUpRight, CheckCircle } from 'lucide-react';

export const DeliveriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deliveries');
      setDeliveries(res.data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleValidate = async (id: number) => {
    if (!window.confirm('Validate this delivery order? Inventory will be reduced and ledger entries logged.')) return;
    setValidatingId(id);
    try {
      await api.post(`/deliveries/${id}/validate`);
      fetchDeliveries();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Validation failed.');
    } finally {
      setValidatingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching delivery orders..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stock Deliveries (Outbound)</h1>
          <p className="text-xs text-slate-500">Record customer shipments and inventory dispatch</p>
        </div>
        <button
          onClick={() => navigate('/deliveries/new')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery</span>
        </button>
      </div>

      {deliveries.length === 0 ? (
        <EmptyState
          title="No Delivery Orders"
          description="Create a delivery order to ship inventory to clients."
          actionLabel="Create Delivery"
          onAction={() => navigate('/deliveries/new')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">Delivery Number</th>
                  <th className="p-3.5">Warehouse</th>
                  <th className="p-3.5">Items Count</th>
                  <th className="p-3.5">Total Quantity</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => {
                  const totalQty = d.items.reduce((sum, item) => sum + item.quantity, 0);
                  const isDone = d.status === OperationStatus.Done;

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-indigo-600 flex items-center gap-2">
                        <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
                        <span>{d.deliveryNumber}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-900">{d.warehouseName}</td>
                      <td className="p-3.5 text-slate-500">{d.items.length} items</td>
                      <td className="p-3.5 font-bold text-slate-900">{totalQty} units</td>
                      <td className="p-3.5">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="p-3.5 text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        {!isDone && (
                          <button
                            onClick={() => handleValidate(d.id)}
                            disabled={validatingId === d.id}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded shadow-xs flex items-center gap-1.5 ml-auto disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{validatingId === d.id ? 'Validating...' : 'Validate'}</span>
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DeliveryOrder, OperationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import {
  Plus,
  ArrowUpRight,
  CheckCircle,
  Truck,
  Box,
  ClipboardList
} from 'lucide-react';

export const DeliveriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);

  // Local state for interactive Pick & Pack checklist steps
  const [pickedMap, setPickedMap] = useState<Record<number, boolean>>({});
  const [packedMap, setPackedMap] = useState<Record<number, boolean>>({});

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

  const handleTogglePick = (id: number) => {
    setPickedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTogglePack = (id: number) => {
    setPackedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-600" />
            <span>Delivery Orders (Outgoing Goods)</span>
          </h1>
          <p className="text-xs text-slate-500">
            3-Stage Fulfillment Process: 1. Pick Items → 2. Pack Items → 3. Validate & Decrement Inventory
          </p>
        </div>
        <button
          onClick={() => navigate('/deliveries/new')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery</span>
        </button>
      </div>

      {/* 3-Step Process Guide Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-purple-50/70 border border-purple-200/80 p-3.5 rounded-xl text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">1</div>
          <div>
            <p className="font-bold text-purple-900">Step 1: Pick Items</p>
            <p className="text-[11px] text-purple-700">Gather physical SKU quantities from shelf locations</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">2</div>
          <div>
            <p className="font-bold text-purple-900">Step 2: Pack Items</p>
            <p className="text-[11px] text-purple-700">Box and prepare outgoing shipment carton</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">3</div>
          <div>
            <p className="font-bold text-purple-900">Step 3: Validate & Dispatch</p>
            <p className="text-[11px] text-purple-700">Automatically deduct stock and log in audit ledger</p>
          </div>
        </div>
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
                  <th className="p-3.5">Items & Quantity</th>
                  <th className="p-3.5">Fulfillment Stages</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => {
                  const totalQty = d.items.reduce((sum, item) => sum + item.quantity, 0);
                  const isDone = d.status === OperationStatus.Done;
                  const isPicked = pickedMap[d.id] || isDone;
                  const isPacked = packedMap[d.id] || isDone;

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-indigo-600 flex items-center gap-2">
                        <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
                        <span>{d.deliveryNumber}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-900">{d.warehouseName}</td>
                      <td className="p-3.5 text-slate-600">
                        <span className="font-extrabold text-slate-900">{totalQty} units</span> ({d.items.length} items)
                      </td>
                      <td className="p-3.5">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Picked & Packed</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePick(d.id)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                                isPicked
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <ClipboardList className="w-3 h-3" />
                              <span>{isPicked ? '✓ Picked' : '1. Pick'}</span>
                            </button>

                            <button
                              onClick={() => handleTogglePack(d.id)}
                              disabled={!isPicked}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer disabled:opacity-40 ${
                                isPacked
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <Box className="w-3 h-3" />
                              <span>{isPacked ? '✓ Packed' : '2. Pack'}</span>
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        {!isDone && (
                          <button
                            onClick={() => handleValidate(d.id)}
                            disabled={validatingId === d.id}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded shadow-xs flex items-center gap-1.5 ml-auto disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{validatingId === d.id ? 'Validating...' : 'Validate & Ship'}</span>
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

import React from 'react';
import { OperationStatus, TransactionType } from '../types';

interface StatusBadgeProps {
  status: string | OperationStatus | TransactionType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let label = String(status);
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';

  if (status === 'In Stock' || status === OperationStatus.Done || status === 'Done') {
    label = 'Done / In Stock';
    if (status === 'In Stock') label = 'In Stock';
    if (status === OperationStatus.Done || status === 'Done') label = 'Done';
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
  } else if (status === 'Low Stock' || status === OperationStatus.Waiting || status === OperationStatus.Ready || status === 'Waiting' || status === 'Ready') {
    label = String(status);
    if (status === OperationStatus.Waiting) label = 'Waiting';
    if (status === OperationStatus.Ready) label = 'Ready';
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
  } else if (status === 'Out of Stock' || status === OperationStatus.Canceled || status === 'Canceled') {
    label = String(status);
    if (status === OperationStatus.Canceled) label = 'Canceled';
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
  } else if (status === OperationStatus.Draft || status === 'Draft') {
    label = 'Draft';
    colorClass = 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
  } else if (status === TransactionType.RECEIPT || status === 'RECEIPT') {
    label = 'RECEIPT';
    colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
  } else if (status === TransactionType.DELIVERY || status === 'DELIVERY') {
    label = 'DELIVERY';
    colorClass = 'bg-purple-100 text-purple-800 border-purple-300 font-semibold';
  } else if (status === TransactionType.TRANSFER_IN || status === 'TRANSFER_IN' || status === TransactionType.TRANSFER_OUT || status === 'TRANSFER_OUT') {
    label = String(status);
    colorClass = 'bg-sky-100 text-sky-800 border-sky-300 font-semibold';
  } else if (status === TransactionType.ADJUSTMENT || status === 'ADJUSTMENT') {
    label = 'ADJUSTMENT';
    colorClass = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
      {label}
    </span>
  );
};

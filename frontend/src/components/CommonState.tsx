import React from 'react';
import { PackageOpen } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading StockSense data...' }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-sm text-slate-500 font-medium">{message}</p>
  </div>
);

export const EmptyState: React.FC<{ title: string; description: string; actionLabel?: string; onAction?: () => void }> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed border-slate-300 p-8">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
      <PackageOpen className="w-6 h-6" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 mt-1 max-w-md">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Inventory Command Center';
    if (path.startsWith('/products/new')) return 'Create Product';
    if (path.startsWith('/products')) return 'Product Catalog';
    if (path.startsWith('/inventory')) return 'Stock Level Matrix';
    if (path.startsWith('/receipts/new')) return 'Create Stock Receipt';
    if (path.startsWith('/receipts')) return 'Stock Receipts';
    if (path.startsWith('/deliveries/new')) return 'Create Stock Delivery';
    if (path.startsWith('/deliveries')) return 'Stock Deliveries';
    if (path.startsWith('/transfers/new')) return 'Create Warehouse Transfer';
    if (path.startsWith('/transfers')) return 'Internal Transfers';
    if (path.startsWith('/adjustments/new')) return 'New Stock Adjustment';
    if (path.startsWith('/adjustments')) return 'Stock Adjustments';
    if (path.startsWith('/ledger')) return 'Audit Stock Ledger';
    if (path.startsWith('/warehouses')) return 'Warehouse Management';
    if (path.startsWith('/settings')) return 'System Settings';
    return 'StockSense';
  };

  const roleName = user?.role === UserRole.Admin
    ? 'Admin'
    : user?.role === UserRole.InventoryManager
    ? 'Inventory Manager'
    : 'Warehouse Staff';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Badge for System Health */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-medium text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>System Healthy</span>
        </div>

        {/* User Role Badge */}
        <div className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-700">
          {roleName}
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

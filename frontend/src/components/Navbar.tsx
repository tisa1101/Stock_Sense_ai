import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import { ShieldCheck, Sun, Moon } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
    if (path.startsWith('/suppliers')) return 'Suppliers';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/notifications')) return 'Notifications';
    return 'StockSense';
  };

  const roleName = user?.role === UserRole.Admin
    ? 'Admin'
    : user?.role === UserRole.InventoryManager
    ? 'Inventory Manager'
    : 'Warehouse Staff';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Badge for System Health */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>System Healthy</span>
        </div>

        {/* User Role Badge */}
        <div className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-400">
          {roleName}
        </div>

        <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <NotificationBell />
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  SlidersHorizontal,
  History,
  Building2,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ChevronRight,
  Layers,
  TrendingUp,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [operationsOpen, setOperationsOpen] = useState(true);

  const roleName = user?.role === UserRole.Admin
    ? 'Admin'
    : user?.role === UserRole.InventoryManager
    ? 'Inventory Manager'
    : 'Warehouse Staff';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md font-extrabold text-lg">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">STOCKSENSE</h1>
          <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Inventory Intelligence</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        {/* Inventory Accordion */}
        <div>
          <button
            onClick={() => setInventoryOpen(!inventoryOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-white transition-colors mt-4 mb-1"
          >
            <span>Inventory</span>
            {inventoryOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {inventoryOpen && (
            <div className="space-y-1 pl-2">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Package className="w-4 h-4 text-slate-400" />
                <span>Products</span>
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Boxes className="w-4 h-4 text-slate-400" />
                <span>Stock Overview</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Operations Accordion */}
        <div>
          <button
            onClick={() => setOperationsOpen(!operationsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-white transition-colors mt-4 mb-1"
          >
            <span>Operations</span>
            {operationsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {operationsOpen && (
            <div className="space-y-1 pl-2">
              <NavLink
                to="/receipts"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                <span>Receipts</span>
              </NavLink>
              <NavLink
                to="/deliveries"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
                <span>Deliveries</span>
              </NavLink>
              <NavLink
                to="/transfers"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <ArrowLeftRight className="w-4 h-4 text-sky-400" />
                <span>Transfers</span>
              </NavLink>
              <NavLink
                to="/adjustments"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Adjustments</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Stock Ledger */}
        <div className="pt-4">
          <NavLink
            to="/ledger"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>Stock Ledger</span>
          </NavLink>
        </div>

        {/* AI Intelligence */}
        <div className="pt-4">
          <div className="px-3 py-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <Bot className="w-3.5 h-3.5" />
            AI Intelligence
          </div>
          <NavLink
            to="/forecast"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-cyan-600 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Demand Forecast</span>
          </NavLink>
          <NavLink
            to="/anomalies"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-cyan-600 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Anomaly Detection</span>
          </NavLink>
          <NavLink
            to="/copilot"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-cyan-600 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI Copilot</span>
          </NavLink>
        </div>

        {/* Warehouses */}
        <NavLink
          to="/warehouses"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Warehouses</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{roleName}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

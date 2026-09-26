import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Settings, ShieldCheck, Database, Key, Server } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const roleName = user?.role === UserRole.Admin
    ? 'Admin'
    : user?.role === UserRole.InventoryManager
    ? 'Inventory Manager'
    : 'Warehouse Staff';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>System Settings & Configuration</span>
        </h1>
        <p className="text-xs text-slate-500">Core architecture details, database status, and user profile information</p>
      </div>

      {/* User Information Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Authenticated Account</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Name</span>
            <span className="font-bold text-slate-900">{user?.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Email Address</span>
            <span className="font-bold text-slate-900">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block">System Role</span>
            <span className="font-bold text-indigo-600">{roleName}</span>
          </div>
        </div>
      </div>

      {/* Architecture & Telemetry Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-600" />
          <span>Architecture & Stack Specifications</span>
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Backend Framework</span>
            <span className="font-bold text-slate-900">ASP.NET Core Web API (.NET 8 Clean Architecture)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Database Engine</span>
            <span className="font-bold text-slate-900">Microsoft SQL Server (EF Core 8)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Authentication Protocol</span>
            <span className="font-bold text-slate-900">JWT Bearer Token with Role-Based Authorization</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Stock Ledger Rule</span>
            <span className="font-bold text-emerald-600">Strict Dual-Ledger Audit Accounting</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">AI Readiness</span>
            <span className="font-bold text-indigo-600">Historical Telemetry Ready for Commit 2 ML Forecasting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

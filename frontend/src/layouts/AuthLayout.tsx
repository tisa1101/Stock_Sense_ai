import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg mb-3">
          <Layers className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">STOCKSENSE</h1>
        <p className="mt-1 text-sm text-slate-400 font-medium">Intelligent Inventory Management & Decision-Support System</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

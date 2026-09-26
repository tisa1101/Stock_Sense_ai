import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { FloatingCopilot } from '../components/FloatingCopilot';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto relative bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
      <FloatingCopilot />
    </div>
  );
};

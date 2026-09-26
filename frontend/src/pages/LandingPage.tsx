import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Package, Boxes, TrendingUp, ShieldAlert, CheckCircle, Bell,
  BarChart3, FileBarChart2, Truck, Menu, X, ArrowRight, Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Layers className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">StockSense</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={() => navigate('/login')} className="text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400">Sign In</button>
              <button onClick={() => navigate('/register')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Intelligent Inventory <span className="text-indigo-600 dark:text-indigo-400">Management</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
            StockSense replaces manual registers and scattered spreadsheets with AI-powered, real-time inventory control.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/register')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all hover:scale-105">Get Started Free</button>
            <button onClick={() => navigate('/login')} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-8 py-3 rounded-lg font-bold text-lg shadow-sm transition-all hover:scale-105">View Demo</button>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div><h3 className="text-4xl font-bold mb-2">5+</h3><p className="text-slate-400 uppercase tracking-widest text-sm font-semibold">Report Types</p></div>
          <div><h3 className="text-4xl font-bold mb-2">3</h3><p className="text-slate-400 uppercase tracking-widest text-sm font-semibold">AI Features</p></div>
          <div><h3 className="text-4xl font-bold mb-2">100%</h3><p className="text-slate-400 uppercase tracking-widest text-sm font-semibold">Real-time Sync</p></div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything you need</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Boxes className="w-6 h-6" />, title: "Real-Time Tracking", desc: "Monitor stock across multiple warehouses with instant updates", color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30" },
            { icon: <TrendingUp className="w-6 h-6" />, title: "AI Forecasting", desc: "Predict demand using machine learning to prevent stockouts", color: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30" },
            { icon: <Bell className="w-6 h-6" />, title: "Smart Alerts", desc: "Auto-generated low stock and operation alerts keep you informed", color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30" },
            { icon: <BarChart3 className="w-6 h-6" />, title: "Advanced Analytics", desc: "Visual dashboards with category breakdowns and trend analysis", color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30" },
            { icon: <ShieldAlert className="w-6 h-6" />, title: "Role-Based Access", desc: "Admin, Manager, and Staff roles with appropriate permissions", color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30" },
            { icon: <FileBarChart2 className="w-6 h-6" />, title: "Professional Reports", desc: "One-click PDF and Excel reports for compliance and planning", color: "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30" },
          ].map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.color}`}>{f.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-100 dark:bg-slate-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center"><div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">1</div><h3 className="text-xl font-bold mb-2 dark:text-white">Track</h3><p className="text-slate-600 dark:text-slate-400">Log receipts, deliveries, and transfers in real time</p></div>
            <ArrowRight className="hidden md:block w-8 h-8 text-slate-400" />
            <div className="flex-1 text-center"><div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">2</div><h3 className="text-xl font-bold mb-2 dark:text-white">Analyze</h3><p className="text-slate-600 dark:text-slate-400">AI detects anomalies and forecasts future demand</p></div>
            <ArrowRight className="hidden md:block w-8 h-8 text-slate-400" />
            <div className="flex-1 text-center"><div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">3</div><h3 className="text-xl font-bold mb-2 dark:text-white">Decide</h3><p className="text-slate-600 dark:text-slate-400">Generate reports and take action with confidence</p></div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="py-24 text-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Powered By Modern Tech</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {['React', '.NET 8', 'SQL Server', 'Python', 'Google Gemini', 'Tailwind CSS'].map(t => (
            <span key={t} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-xs">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-lg text-white">StockSense</span>
          </div>
          <div className="text-slate-400 text-sm">Built for Hackathon 2026 • Team StockSense</div>
        </div>
      </footer>
    </div>
  );
};

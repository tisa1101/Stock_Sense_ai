import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  LayoutDashboard, Package, TrendingUp, ShoppingCart, Truck,
  BarChart3, Zap, FileText, Bell, Settings, Search,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, Sparkles
} from 'lucide-react';

const forecastData = [
  { day: 'Mon', actual: 420, forecast: 400 },
  { day: 'Tue', actual: 380, forecast: 410 },
  { day: 'Wed', actual: 460, forecast: 440 },
  { day: 'Thu', actual: 430, forecast: 450 },
  { day: 'Fri', actual: 510, forecast: 490 },
  { day: 'Sat', actual: 480, forecast: 500 },
  { day: 'Sun', actual: null, forecast: 520 },
  { day: 'Mon', actual: null, forecast: 545 },
  { day: 'Tue', actual: null, forecast: 560 },
];

const kpis = [
  { label: 'Total Inventory', value: '1,240', change: '+12%', up: true, color: 'text-violet-400' },
  { label: 'Total Revenue', value: '₹8.24L', change: '+18%', up: true, color: 'text-emerald-400' },
  { label: 'Low Stock Items', value: '12', change: '-4%', up: false, color: 'text-amber-400' },
  { label: 'Order Fulfillment', value: '98%', change: '+2%', up: true, color: 'text-cyan-400' },
];

const aiInsights = [
  { icon: '↑', text: 'Increase stock: Wireless Headphones', sub: 'Demand expected to rise by 35%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: '🛒', text: 'Consider reordering Laptop Chargers', sub: 'Stock may run out in 5 days', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: '⚠', text: 'Slow-moving items detected', sub: '3 products haven\'t sold in 30+ days', color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Package, label: 'Inventory' },
  { icon: TrendingUp, label: 'Demand Forecast' },
  { icon: ShoppingCart, label: 'Orders' },
  { icon: Truck, label: 'Suppliers' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Zap, label: 'AI Insights' },
  { icon: FileText, label: 'Reports' },
  { icon: Bell, label: 'Alerts' },
  { icon: Settings, label: 'Settings' },
];

export const DashboardPreview: React.FC = () => {
  return (
    <div className="relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-indigo-600/20 to-cyan-500/20 blur-[80px] rounded-3xl" />

      {/* 3D Container with floating animation */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl"
        style={{ background: 'linear-gradient(145deg, #0d111c 0%, #060810 100%)' }}
      >
        <div className="flex" style={{ minHeight: '440px' }}>

          {/* Sidebar */}
          <div className="w-32 border-r border-white/[0.06] flex flex-col py-4 px-2.5 flex-shrink-0 bg-[#060810]/90">
            <div className="flex items-center gap-2 px-2 mb-5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                <div className="w-3 h-3 rounded-sm bg-white/90" />
              </div>
              <span className="text-white font-bold text-xs">StockSense</span>
            </div>
            <div className="flex flex-col gap-1">
              {sidebarItems.map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-[10px] truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 w-48">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 text-xs">Search SKU, category...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sync Active
                </div>
                <div className="relative">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400" />
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 p-4 flex flex-col gap-3">
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-2.5">
                {kpis.map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="rounded-xl p-3 border border-white/[0.06] bg-white/[0.02]"
                  >
                    <div className="text-[10px] text-slate-400 mb-1">{kpi.label}</div>
                    <div className={`text-base font-extrabold ${kpi.color} mb-0.5`}>{kpi.value}</div>
                    <div className={`flex items-center gap-0.5 text-[9px] font-bold ${kpi.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {kpi.change}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart & AI Insights Grid */}
              <div className="grid grid-cols-12 gap-3 flex-1">
                {/* Demand Forecast Chart */}
                <div className="col-span-8 rounded-xl p-3.5 border border-white/[0.06] bg-white/[0.02] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                        Demand Forecast (Next 30 Days)
                      </span>
                      <span className="text-[10px] text-slate-400 block">Actual sales vs SES predicted trend</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-1 bg-violet-400 rounded-full" />
                        <span className="text-[9px] text-slate-400">Historical</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-1 bg-cyan-400 rounded-full" style={{ borderStyle: 'dashed' }} />
                        <span className="text-[9px] text-cyan-400 font-semibold">AI Projected</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={110}>
                    <AreaChart data={forecastData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                      <defs>
                        <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="forecastG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#0a0d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px', color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2} fill="url(#actualG)" dot={false} />
                      <Area type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={2} strokeDasharray="3 3" fill="url(#forecastG)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* AI Recommendations Panel */}
                <div className="col-span-4 rounded-xl p-3 border border-violet-500/20 bg-violet-500/[0.04] flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    AI Recommendations
                  </div>
                  {aiInsights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className={`rounded-lg p-2 ${insight.bg} border border-white/[0.04]`}
                    >
                      <div className={`text-[10px] font-bold ${insight.color} leading-tight`}>{insight.icon} {insight.text}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{insight.sub}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Notification Chip */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute -right-6 top-10 w-52 rounded-2xl border border-amber-500/30 p-3.5 shadow-2xl backdrop-blur-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(99,102,241,0.1))' }}
      >
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Low Stock Warning</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Wireless Headphones stock &lt; Reorder Level</div>
          </div>
        </div>
      </motion.div>

      {/* Floating Metric Pill */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute -left-6 bottom-10 w-48 rounded-2xl border border-emerald-500/30 p-3.5 shadow-2xl backdrop-blur-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">98% Fulfillment</div>
            <div className="text-[10px] text-emerald-400 font-semibold">↑ 2% vs last week</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

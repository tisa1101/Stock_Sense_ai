import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ranges = ['7D', '30D', '90D', '1Y'];

const revenueData: Record<string, Array<{ name: string; value: number }>> = {
  '7D': [
    { name: 'Mon', value: 42000 }, { name: 'Tue', value: 38000 }, { name: 'Wed', value: 55000 },
    { name: 'Thu', value: 48000 }, { name: 'Fri', value: 72000 }, { name: 'Sat', value: 65000 }, { name: 'Sun', value: 51000 },
  ],
  '30D': Array.from({ length: 30 }, (_, i) => ({ name: `D${i + 1}`, value: Math.floor(30000 + Math.random() * 40000) })),
  '90D': Array.from({ length: 12 }, (_, i) => ({ name: `W${i + 1}`, value: Math.floor(200000 + Math.random() * 150000) })),
  '1Y': [
    { name: 'Jan', value: 420000 }, { name: 'Feb', value: 380000 }, { name: 'Mar', value: 510000 },
    { name: 'Apr', value: 490000 }, { name: 'May', value: 620000 }, { name: 'Jun', value: 580000 },
    { name: 'Jul', value: 690000 }, { name: 'Aug', value: 720000 }, { name: 'Sep', value: 680000 },
    { name: 'Oct', value: 750000 }, { name: 'Nov', value: 810000 }, { name: 'Dec', value: 890000 },
  ],
};

const customTooltipStyle = {
  contentStyle: { background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '12px' },
};

export const AnalyticsPreview: React.FC = () => {
  const [range, setRange] = useState('7D');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="analytics" ref={ref} className="bg-[#030712] py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-5">
            ✦ ANALYTICS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Turn data into{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">competitive advantage</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{ background: '#080b10' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <div>
              <h3 className="text-white font-semibold">Revenue & Inventory Analytics</h3>
              <p className="text-slate-500 text-xs mt-0.5">Live dashboard preview</p>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-1">
              {ranges.map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    range === r
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main revenue chart */}
            <div className="lg:col-span-2">
              <div className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Revenue Trend</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData[range]}>
                  <defs>
                    <linearGradient id="aRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Tooltip {...customTooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#aRev)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sidebar stats */}
            <div className="flex flex-col gap-4">
              {[
                { label: 'Stock Turnover', value: '4.2x', change: '+0.8', color: '#06b6d4', data: [{ v: 3.1 }, { v: 3.5 }, { v: 3.2 }, { v: 4.0 }, { v: 3.8 }, { v: 4.2 }] },
                { label: 'Fulfillment Rate', value: '97.8%', change: '+1.2%', color: '#10b981', data: [{ v: 94 }, { v: 95 }, { v: 96 }, { v: 95 }, { v: 97 }, { v: 97.8 }] },
                { label: 'Dead Stock', value: '3.1%', change: '-0.5%', color: '#f59e0b', data: [{ v: 4.2 }, { v: 3.8 }, { v: 3.5 }, { v: 3.3 }, { v: 3.2 }, { v: 3.1 }] },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-4 border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">{stat.label}</span>
                    <span className="text-xs font-semibold" style={{ color: stat.color }}>{stat.change}</span>
                  </div>
                  <div className="text-lg font-bold text-white mb-2">{stat.value}</div>
                  <ResponsiveContainer width="100%" height={30}>
                    <LineChart data={stat.data}>
                      <Line type="monotone" dataKey="v" stroke={stat.color} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

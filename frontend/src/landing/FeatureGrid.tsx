import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Package, Bell, Truck, BarChart3, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer } from 'recharts';

const miniData1 = [{ v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 50 }, { v: 75 }, { v: 65 }, { v: 90 }];
const miniData3 = [{ v: 20 }, { v: 40 }, { v: 30 }, { v: 55 }, { v: 45 }, { v: 70 }, { v: 60 }, { v: 80 }];

const features = [
  {
    icon: TrendingUp,
    title: 'AI Demand Forecasting',
    desc: 'Predict future demand trends using Simple Exponential Smoothing and statistical sales patterns.',
    accentFrom: '#8b5cf6',
    visual: (
      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={miniData1} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="url(#fg1)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    ),
  },
  {
    icon: Package,
    title: 'Real-Time Inventory Tracking',
    desc: 'Monitor multi-warehouse stock allocations, physical vs reserved quantities, and live thresholds.',
    accentFrom: '#06b6d4',
    visual: (
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { label: 'Central WH', val: '840', pct: 85 },
          { label: 'East Hub', val: '520', pct: 60 },
          { label: 'West WH', val: '910', pct: 92 },
        ].map((w) => (
          <div key={w.label} className="text-center p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <div className="text-[10px] text-slate-400 mb-1">{w.label}</div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-1 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="text-[10px] text-cyan-400 font-bold">{w.val}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Bell,
    title: 'Smart Alert System',
    desc: 'Automated notification engine warns on low stock, zero inventory events, and critical anomalies.',
    accentFrom: '#f59e0b',
    visual: (
      <div className="flex flex-col gap-1.5 pt-1">
        {[
          { type: 'Critical', msg: 'USB Chargers: Stock < Reorder', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
          { type: 'Warning', msg: 'Headphones: Velocity spike +45%', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        ].map((a) => (
          <div key={a.msg} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] font-medium ${a.color}`}>
            <Bell className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{a.msg}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Truck,
    title: 'Supplier Intelligence',
    desc: 'Score supplier performance, calculate order lead times, and track linked receipt histories.',
    accentFrom: '#10b981',
    visual: (
      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={[{ s: 'Acme', v: 95 }, { s: 'TechPro', v: 78 }, { s: 'Globe', v: 88 }, { s: 'Swift', v: 65 }]} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="v" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics Suite',
    desc: 'Category breakdown donuts, warehouse utilization comparisons, and daily stock movement heatmaps.',
    accentFrom: '#6366f1',
    visual: (
      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={miniData3} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ),
  },
  {
    icon: Zap,
    title: 'AI Decision Engine',
    desc: 'Context-aware Gemini model generates precise reorder recommendations and stock movement strategies.',
    accentFrom: '#ec4899',
    visual: (
      <div className="flex flex-col gap-1.5 pt-1">
        {[
          { action: '↑ Reorder 120u', item: 'Wireless Headphones', conf: '96%' },
          { action: '→ Transfer 50u', item: 'Hub WH → West WH', conf: '89%' },
        ].map((r) => (
          <div key={r.item} className="flex items-center justify-between bg-pink-500/[0.08] border border-pink-500/20 rounded-lg px-2.5 py-1.5">
            <div>
              <span className="text-[10px] font-bold text-pink-400">{r.action} </span>
              <span className="text-[10px] text-slate-300 truncate max-w-[120px] inline-block align-bottom">{r.item}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">{r.conf}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export const FeatureGrid: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" ref={ref} className="bg-[#030712] py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
            ✦ PRODUCT CAPABILITIES
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">intelligent inventory</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            From automated forecasting algorithms to immutable audit logs, StockSense powers modern inventory agility.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isHovered = hovered === i;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -5 }}
                className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl overflow-hidden cursor-default group transition-all"
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${f.accentFrom}20 0%, transparent 70%)`,
                  }}
                />

                {/* Top Icon and Badge */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: `${f.accentFrom}20`, border: `1px solid ${f.accentFrom}40` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: f.accentFrom }} />
                  </div>
                  <Sparkles className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                </div>

                <h3 className="text-white font-bold text-lg mb-2 relative z-10">{f.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 relative z-10">{f.desc}</p>

                {/* Interactive Visual Element */}
                <div className="relative z-10 rounded-2xl bg-[#060810]/80 border border-white/[0.04] p-3 mb-4">
                  {f.visual}
                </div>

                <div
                  className="flex items-center gap-1 text-xs font-bold relative z-10 transition-transform group-hover:translate-x-1"
                  style={{ color: f.accentFrom }}
                >
                  Explore capability <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Sparkles, Layers, ArrowUpRight, BarChart2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const qData = [
  { name: 'Q1', actual: 320, optimal: 300 },
  { name: 'Q2', actual: 480, optimal: 440 },
  { name: 'Q3', actual: 610, optimal: 590 },
  { name: 'Q4', actual: 790, optimal: 720 },
];

const waveData = [
  { v: 40, v2: 60 }, { v: 65, v2: 45 }, { v: 55, v2: 70 },
  { v: 80, v2: 50 }, { v: 60, v2: 85 }, { v: 95, v2: 65 }, { v: 75, v2: 90 }
];

export const DashboardPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Background Coral Ambient Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#ee4d38]/20 via-[#38bdf8]/10 to-transparent blur-3xl rounded-3xl" />

      {/* 2x2 Increff-Style Modular Widget Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Widget 1: Multichannel ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-[#141d33]/90 p-5 backdrop-blur-xl flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white tracking-wide">Multichannel ROI</span>
              <span className="text-[10px] font-bold text-[#ee4d38] bg-[#ee4d38]/10 px-2 py-0.5 rounded-full border border-[#ee4d38]/20">
                +38% Lift
              </span>
            </div>
            
            <div className="h-28 w-full mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={qData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="coralArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ee4d38" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ee4d38" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="actual" stroke="#ee4d38" strokeWidth={2} fill="url(#coralArea)" dot={{ r: 2, fill: '#ee4d38' }} />
                  <Area type="monotone" dataKey="optimal" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="3 3" fill="none" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-[10px] text-slate-400">Quarterly Yield</span>
            <button
              onClick={() => {
                const el = document.querySelector('#roi-calculator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-full bg-[#ee4d38] hover:bg-[#ff5a47] text-white text-[10px] font-bold tracking-wider uppercase transition-colors"
            >
              Explore
            </button>
          </div>
        </motion.div>

        {/* Widget 2: Merchandising ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-white/[0.08] bg-[#141d33]/90 p-5 backdrop-blur-xl flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white tracking-wide">Merchandising ROI</span>
              <span className="text-[10px] font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded-full border border-[#38bdf8]/20">
                OTB Synced
              </span>
            </div>

            <div className="h-28 w-full mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <Line type="monotone" dataKey="v" stroke="#ee4d38" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="v2" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-[10px] text-slate-400">Sell-Through Rate</span>
            <span className="text-xs font-black text-emerald-400">89.4% Full Price</span>
          </div>
        </motion.div>

        {/* Widget 3: StockSense AI Copilot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-white/[0.08] bg-[#141d33]/90 p-5 backdrop-blur-xl flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-[#ee4d38]/20 border border-[#ee4d38]/30 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#ff7d6b]" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">StockSense AI</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0b1120] border border-white/[0.04] mb-3">
              <div className="text-[10px] font-mono text-slate-300 mb-1">
                "Reorder 120u Stepper Motors (Stockout in 4d)"
              </div>
              <div className="flex items-center justify-between text-[9px] text-emerald-400 font-semibold">
                <span>Confidence: 96%</span>
                <span>Lead: 3.2 days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">Decision Engine</span>
            <span className="text-[10px] font-bold text-violet-400">Gemini 2.0 Flash</span>
          </div>
        </motion.div>

        {/* Widget 4: Real-time WMS Operations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl border border-white/[0.08] bg-[#141d33]/90 p-5 backdrop-blur-xl flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">WMS Traceability</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[#0b1120] text-center border border-white/[0.04]">
                <div className="text-[9px] text-slate-400">Accuracy</div>
                <div className="text-sm font-black text-emerald-400">99.8%</div>
              </div>
              <div className="p-2 rounded-lg bg-[#0b1120] text-center border border-white/[0.04]">
                <div className="text-[9px] text-slate-400">Sync Time</div>
                <div className="text-sm font-black text-cyan-400">&lt; 8s</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">Audit Status</span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Verified
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

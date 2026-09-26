import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Check, ArrowRight, Zap } from 'lucide-react';

const problems = [
  'Manual Registers & Physical Ledgers',
  'Scattered Disconnected Spreadsheets',
  'Delayed Reactive Decisions',
  'Costly Stockouts & Surplus Overstock',
  'Untracked Lost Revenue & Shrinkage',
];

const solutions = [
  'Single Real-Time Source of Truth',
  'Automated Machine Learning Forecasting',
  'Proactive Low-Stock & Anomaly Alerts',
  'Optimized Just-in-Time Replenishment',
  'Audited Immutable Stock Ledger Trail',
];

export const ProblemSolution: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-[#030712] py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-violet-600/8 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
            ✦ THE EVOLUTION
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Inventory shouldn't be a{' '}
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 bg-clip-text text-transparent">guessing game.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Traditional inventory workflows leave businesses reacting to crises. StockSense replaces chaos with intelligent certainty.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-11 gap-6 items-center">
          {/* Left - The Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 rounded-3xl border border-rose-500/20 bg-rose-500/[0.03] p-8 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                  <X className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Traditional Inventory</h3>
                  <p className="text-xs text-rose-400">Manual, Error-Prone & Blind</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300">Outdated</span>
            </div>

            <div className="flex flex-col gap-4">
              {problems.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-rose-500/[0.04] border border-rose-500/10"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-rose-400" />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{p}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center Transformation Conduit */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-4 lg:py-0">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.5, type: 'spring' }}
              className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.5)]"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          {/* Right - The StockSense Way */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">StockSense Intelligence</h3>
                  <p className="text-xs text-emerald-400">Automated, Predictive & Precise</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">AI Powered</span>
            </div>

            <div className="flex flex-col gap-4">
              {solutions.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-200 text-sm font-medium">{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

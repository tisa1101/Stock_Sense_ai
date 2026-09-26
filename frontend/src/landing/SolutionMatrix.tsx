import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Boxes, Layers, RefreshCw, BarChart2, Truck, 
  ArrowRight, ShieldCheck, Zap, Network, Building, Compass
} from 'lucide-react';

const solutionPillars = [
  {
    id: 'planning',
    title: 'Merchandise & Demand Planning',
    subtitle: 'What to buy, how much, and when to replenish',
    icon: Compass,
    color: '#8b5cf6',
    items: [
      { name: 'SKU Demand Forecasting', desc: 'Predict SKU-level retail demand using time-series ML to eliminate stockouts & overstock.' },
      { name: 'Automated Reordering', desc: 'Auto-calculate reorder points factoring supplier lead times, buffer safety stock, and velocity.' },
      { name: 'Open-To-Buy (OTB) & Budgeting', desc: 'Align procurement capital with live seasonal sales trajectories and margin targets.' },
    ],
    metric: '35% Higher Forecast Accuracy',
  },
  {
    id: 'allocation',
    title: 'Inventory Allocation & Replenishment',
    subtitle: 'The right stock in the right warehouse at the right time',
    icon: Layers,
    color: '#06b6d4',
    items: [
      { name: 'Multi-Warehouse Allocation', desc: 'Intelligently allocate incoming receipts to regional hubs based on localized demand.' },
      { name: 'Inter-Warehouse Rebalancing', desc: 'Trigger automated stock transfers between facilities to relieve dead stock without markdowns.' },
      { name: 'Dynamic Safety Stock Adjustments', desc: 'Automatically adapt minimum stock thresholds based on seasonal volatility.' },
    ],
    metric: '40% Reduction in Stockouts',
  },
  {
    id: 'wms',
    title: 'Warehouse Management (WMS)',
    subtitle: '100% item-level traceability from dock to dispatch',
    icon: Boxes,
    color: '#10b981',
    items: [
      { name: 'Real-Time Inbound & Putaway', desc: 'Validate purchase receipts against vendor delivery notes with zero discrepancy.' },
      { name: 'Strict Audit Ledger', desc: 'Immutable, double-entry inventory ledger tracking every internal move, pick, and transfer.' },
      { name: 'Cross-Docking Acceleration', desc: 'Direct inbound-to-outbound transfer routing to bypass long storage cycles.' },
    ],
    metric: '99.8% Inventory Record Accuracy',
  },
  {
    id: 'orchestration',
    title: 'Order & Channel Orchestration',
    subtitle: 'Omnichannel routing and live multi-location sync',
    icon: Network,
    color: '#f59e0b',
    items: [
      { name: 'Sub-10s Multi-Channel Sync', desc: 'Instant inventory pool synchronization across B2B wholesale, web, and physical stores.' },
      { name: 'Smart Order Routing', desc: 'Route customer and store delivery orders to the nearest node with available stock.' },
      { name: 'Supplier Inbound Tracking', desc: 'Rate vendor on-time fulfillment, defect ratios, and replenishment reliability.' },
    ],
    metric: '3x Faster Order Fulfillment',
  },
];

export const SolutionMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState(solutionPillars[0].id);

  const activeSolution = solutionPillars.find(p => p.id === activeTab) || solutionPillars[0];
  const Icon = activeSolution.icon;

  return (
    <section id="solutions" className="bg-[#030712] py-28 relative overflow-hidden border-t border-white/[0.06]">
      {/* Ambient background aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-violet-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            ✦ END-TO-END SUPPLY CHAIN SUITE
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            A Unified Platform for{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Complete Inventory Mastery</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Inspired by world-class retail merchandising & enterprise supply chain architectures. Connect every node of your operations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 bg-white/[0.02] p-1.5 rounded-2xl border border-white/[0.06] backdrop-blur-xl max-w-4xl mx-auto">
          {solutionPillars.map((p) => {
            const TabIcon = p.icon;
            const isActive = activeTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <TabIcon className="w-4 h-4" style={{ color: isActive ? '#fff' : p.color }} />
                <span>{p.title.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Active Solution Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSolution.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-12 gap-8 items-stretch rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 lg:p-10 backdrop-blur-2xl"
          >
            {/* Left Pillar Overview */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06] pb-8 lg:pb-0 lg:pr-8">
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                  style={{ background: `${activeSolution.color}20`, border: `1px solid ${activeSolution.color}40` }}
                >
                  <Icon className="w-7 h-7" style={{ color: activeSolution.color }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{activeSolution.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{activeSolution.subtitle}</p>
              </div>

              <div className="rounded-2xl p-5 border border-white/[0.06] bg-[#060810]/80">
                <div className="text-xs text-slate-400 mb-1">PROVEN IMPACT</div>
                <div className="text-xl sm:text-2xl font-black" style={{ color: activeSolution.color }}>
                  {activeSolution.metric}
                </div>
                <div className="text-xs text-slate-400 mt-1">Based on simulated retail enterprise benchmarks</div>
              </div>
            </div>

            {/* Right Pillar Modules Grid */}
            <div className="lg:col-span-7 flex flex-col justify-center gap-4">
              {activeSolution.items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: activeSolution.color }} />
                        {item.name}
                      </h4>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

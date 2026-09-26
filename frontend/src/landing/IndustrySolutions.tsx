import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Shirt, ShoppingBag, Wrench, HeartPulse, Truck, Check, Sparkles } from 'lucide-react';

const industries = [
  {
    id: 'electronics',
    name: 'Electronics & Hardware',
    icon: Cpu,
    color: '#06b6d4',
    headline: 'High-velocity component tracking with strict obsolescence management',
    points: [
      'Component batch & serial number traceability across multi-depot hubs.',
      'Automated depreciation warnings for fast-aging tech hardware & chips.',
      'Lead-time buffer calculations for unpredictable semiconductor procurement.',
    ],
    stat: '42% Reduction in Component Obsolescence',
  },
  {
    id: 'retail',
    name: 'Retail & Omnichannel FMCG',
    icon: ShoppingBag,
    color: '#8b5cf6',
    headline: 'Single inventory pool across brick-and-mortar stores & online webshops',
    points: [
      'Sub-10s inventory synchronization across e-commerce & in-store POS.',
      'Endless aisle support: fulfill in-store shortages from regional distribution hubs.',
      'Seasonal demand peak forecasting for Black Friday, Diwali & Cyber Week surges.',
    ],
    stat: '99.4% Order Accuracy Across Channels',
  },
  {
    id: 'apparel',
    name: 'Fashion & Apparel',
    icon: Shirt,
    color: '#ec4899',
    headline: 'Style-Color-Size matrix planning with markdown preservation',
    points: [
      'Granular size-level demand forecasting to avoid broken size assortments.',
      'Dynamic markdown optimization to liquidate seasonal collections at maximum margin.',
      'Automated inter-store rebalancing between low and high sell-through boutiques.',
    ],
    stat: '28% Margin Protection on Markdown Stock',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Automotive',
    icon: Wrench,
    color: '#f59e0b',
    headline: 'Just-in-Time (JIT) raw material & spare part replenishment',
    points: [
      'Synchronized raw material delivery schedules tied to assembly production runs.',
      'Critical spare parts anomaly alerting to prevent factory downtime.',
      'Vendor quality rating & delivery punctuality scoring.',
    ],
    stat: '35% Lower Safety Stock Capital Tied Up',
  },
  {
    id: 'logistics',
    name: 'Third-Party Logistics (3PL)',
    icon: Truck,
    color: '#10b981',
    headline: 'Multi-tenant warehouse management with cross-dock throughput',
    points: [
      'Multi-client inventory isolation with centralized master ledger tracking.',
      'Cross-docking dispatch workflows that bypass long racking dwell times.',
      'Configurable pick-and-pack rules for B2B pallet orders and B2C single parcels.',
    ],
    stat: '3.5x Faster Inbound-to-Outbound Turnaround',
  },
];

export const IndustrySolutions: React.FC = () => {
  const [activeInd, setActiveInd] = useState(industries[0].id);
  const current = industries.find((i) => i.id === activeInd) || industries[0];
  const Icon = current.icon;

  return (
    <section id="industries" className="bg-[#030712] py-28 relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
            ✦ INDUSTRY-TAILORED INTELLIGENCE
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Engineered for{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Every High-Velocity Industry</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Whether managing delicate electronic chips, fast-moving fashion sizes, or automotive assemblies, StockSense adapts to your domain rules.
          </p>
        </div>

        {/* Industry Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {industries.map((ind) => {
            const IndIcon = ind.icon;
            const isSelected = activeInd === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveInd(ind.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                  isSelected
                    ? 'border-violet-500/50 bg-violet-600/20 text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]'
                    : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <IndIcon className="w-4 h-4" style={{ color: isSelected ? '#fff' : ind.color }} />
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Industry Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 lg:p-12 backdrop-blur-2xl"
          >
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${current.color}20`, border: `1px solid ${current.color}40` }}
              >
                <Icon className="w-6 h-6" style={{ color: current.color }} />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-snug">{current.headline}</h3>

              <div className="flex flex-col gap-3.5 mb-8">
                {current.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${current.color}20` }}>
                      <Check className="w-3 h-3" style={{ color: current.color }} />
                    </div>
                    <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Metric Showcase */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="rounded-2xl border border-white/[0.08] bg-[#060810] p-8 text-center flex flex-col items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 mb-4" style={{ color: current.color }} />
                <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">VALIDATED BENCHMARK</div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ color: current.color }}>
                  {current.stat.split(' ')[0]}
                </div>
                <div className="text-sm font-semibold text-slate-300 max-w-xs">
                  {current.stat.substring(current.stat.indexOf(' ') + 1)}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

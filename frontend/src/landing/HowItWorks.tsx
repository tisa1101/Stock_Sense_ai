import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, Brain, Lightbulb, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect Your Operations',
    desc: 'Unify warehouses, receipts, deliveries, and internal stock adjustments into an immutable, real-time ledger.',
    icon: Database,
    color: '#6366f1',
    details: ['Multi-warehouse support', 'Automated stock ledger', 'Role-based access'],
  },
  {
    number: '02',
    title: 'Autonomous AI Analysis',
    desc: 'Our statsmodels SES engine & Z-score detectors uncover hidden demand velocity and operational bottlenecks.',
    icon: Brain,
    color: '#8b5cf6',
    details: ['Time-series forecasting', 'Outlier anomaly scan', 'Gemini copilot insights'],
  },
  {
    number: '03',
    title: 'Execute High-Confidence Actions',
    desc: 'Generate compliance-ready PDF & Excel reports, validate transfers, and reorder before inventory hits zero.',
    icon: Lightbulb,
    color: '#06b6d4',
    details: ['1-click PDF/Excel export', 'Supplier performance tracking', 'Zero stockout guarantee'],
  },
];

export const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" ref={ref} className="bg-[#030712] py-28 relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
            ✦ WORKFLOW
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            From data to decisions in{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">3 simple steps</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Eliminate complexity. StockSense transforms messy spreadsheets into automated operational clarity.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-20 left-[16%] right-[16%] h-0.5 bg-white/[0.08]">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.4, duration: 1, ease: 'easeInOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 35 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.2 + 0.3 }}
                  className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl flex flex-col items-center text-center group hover:border-violet-500/40 transition-colors"
                >
                  {/* Step Badge and Icon */}
                  <div className="relative mb-8">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-transform group-hover:scale-105"
                      style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}
                    >
                      <Icon className="w-9 h-9" style={{ color: step.color }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md z-20"
                      style={{ background: step.color }}
                    >
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{step.desc}</p>

                  <div className="flex flex-col gap-2 w-full pt-4 border-t border-white/[0.06] text-left">
                    {step.details.map((d) => (
                      <div key={d} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: step.color }} />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

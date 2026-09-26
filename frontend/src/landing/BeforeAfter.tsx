import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Check } from 'lucide-react';

const before = [
  'Manual stock counting',
  'Spreadsheet dependency',
  'Delayed, inaccurate insights',
  'Unexpected stockouts',
  'Overstock & dead inventory',
  'No predictive visibility',
  'Reactive decision-making',
];

const after = [
  'Real-time inventory tracking',
  'AI-powered forecasting',
  'Instant, accurate analytics',
  'Predictive low-stock alerts',
  'Optimized stock levels',
  'AI-driven demand forecasting',
  'Proactive data-driven decisions',
];

export const BeforeAfter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-[#030712] py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            A complete transformation.
          </h2>
          <p className="text-slate-400 text-lg">See the difference StockSense makes.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                <X className="w-4 h-4 text-rose-400" />
              </div>
              <h3 className="text-rose-400 font-bold text-lg">Before StockSense</h3>
            </div>
            <div className="flex flex-col gap-3">
              {before.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <X className="w-2.5 h-2.5 text-rose-500" />
                  </div>
                  <span className="text-slate-400 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-emerald-400 font-bold text-lg">After StockSense</h3>
              </div>
              <div className="flex flex-col gap-3">
                {after.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

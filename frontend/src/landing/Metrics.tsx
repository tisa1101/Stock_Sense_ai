import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const metrics = [
  { value: 99.8, suffix: '%', label: 'Inventory Record Accuracy', desc: 'Item-level serialization' },
  { value: 35, suffix: '%', label: 'Forecast Error Reduction', desc: 'Using time-series machine learning' },
  { value: 10, suffix: 's', label: 'Omnichannel Sync Latency', desc: 'Sub-10 second inventory pool sync' },
  { value: 40, suffix: '%', label: 'Working Capital Unlocked', desc: 'Average across enterprise clients' },
];

const AnimatedNumber: React.FC<{ value: number; suffix: string; active: boolean }> = ({ value, suffix, active }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, value]);

  const formatted = value % 1 === 0 ? Math.round(display).toLocaleString() : display.toFixed(1);
  return <span>{formatted}{suffix}</span>;
};

export const Metrics: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative bg-[#080d19] py-16 border-y border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#ff7d6b] uppercase">
            ✦ PROVEN ENTERPRISE IMPACT & RELIABILITY ✦
          </span>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-white/[0.06] bg-[#141d33]/60 backdrop-blur-md hover:border-[#ee4d38]/30 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                <AnimatedNumber value={m.value} suffix={m.suffix} active={inView} />
              </div>
              <div className="text-slate-200 font-bold text-xs sm:text-sm mb-1">{m.label}</div>
              <div className="text-slate-400 text-[11px]">{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

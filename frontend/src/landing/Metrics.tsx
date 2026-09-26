import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const metrics = [
  { value: 5, suffix: 'K+', label: 'Active Businesses', desc: 'Simulated demo volume' },
  { value: 2, suffix: 'M+', label: 'Products Managed', desc: 'Across real-time SKUs' },
  { value: 99.9, suffix: '%', label: 'System Reliability', desc: 'High-availability architecture' },
  { value: 30, suffix: '%', label: 'Avg Cost Reduction', desc: 'Through automated replenishment' },
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
    <section ref={ref} className="relative bg-[#030712] py-20 border-y border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-indigo-600/5 to-cyan-500/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-extrabold tracking-[0.25em] text-slate-400 uppercase">
            ✦ TRUSTED BY MODERN DATA-DRIVEN ENTERPRISES ✦
          </span>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-md hover:border-violet-500/30 transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent mb-2">
                <AnimatedNumber value={m.value} suffix={m.suffix} active={inView} />
              </div>
              <div className="text-white font-bold text-sm mb-1">{m.label}</div>
              <div className="text-slate-400 text-xs">{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

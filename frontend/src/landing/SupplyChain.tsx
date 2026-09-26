import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Warehouse, Building2, Store, User } from 'lucide-react';

const nodes = [
  { icon: Warehouse, label: 'Warehouse', sub: '2,400 units', color: '#8b5cf6', x: 10, pulse: '#8b5cf620' },
  { icon: Building2, label: 'Distribution', sub: 'Processing...', color: '#6366f1', x: 35, pulse: '#6366f120' },
  { icon: Store, label: 'Store', sub: '320 units', color: '#06b6d4', x: 60, pulse: '#06b6d420' },
  { icon: User, label: 'Customer', sub: 'Delivered ✓', color: '#10b981', x: 85, pulse: '#10b98120' },
];

export const SupplyChain: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-[#030712] py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-5">
            ✦ SUPPLY CHAIN
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Real-time supply chain{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">visibility</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Monitor every stage of your supply chain in one unified view.
          </p>
        </motion.div>

        {/* Supply chain diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl border border-white/[0.06] p-8 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative flex items-center justify-between">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.15 + 0.5 }}
                    className="flex flex-col items-center gap-3 relative z-10"
                  >
                    {/* Node */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                      style={{ background: `${node.color}15`, border: `1px solid ${node.color}30` }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{ boxShadow: [`0 0 0px ${node.color}00`, `0 0 25px ${node.color}25`, `0 0 0px ${node.color}00`] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
                      />
                      <Icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: node.color }} />
                    </motion.div>
                    <div className="text-center">
                      <div className="text-white text-xs md:text-sm font-semibold">{node.label}</div>
                      <div className="text-slate-500 text-[10px] md:text-xs mt-0.5">{node.sub}</div>
                    </div>
                  </motion.div>

                  {/* Animated connection line */}
                  {i < nodes.length - 1 && (
                    <div className="flex-1 relative h-px mx-3 md:mx-4">
                      <div className="absolute inset-0 bg-white/10 rounded-full" />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `linear-gradient(90deg, ${node.color}, ${nodes[i + 1].color})`, transformOrigin: 'left' }}
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: 1 } : {}}
                        transition={{ delay: i * 0.2 + 0.8, duration: 0.6 }}
                      />
                      {/* Moving dot */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                        style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }}
                        animate={{ left: ['0%', 'calc(100% - 8px)'] as any }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 + 1, ease: 'linear' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Info cards below */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'In Transit', value: '3 Shipments', color: '#6366f1' },
              { label: 'Avg Lead Time', value: '3.2 Days', color: '#8b5cf6' },
              { label: 'Warehouse Capacity', value: '73% Used', color: '#06b6d4' },
              { label: 'On-time Delivery', value: '96.8%', color: '#10b981' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4 border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

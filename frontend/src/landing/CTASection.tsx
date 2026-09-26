import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MessageSquare } from 'lucide-react';

export const CTASection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="bg-[#0b1120] py-28 relative overflow-hidden border-t border-white/[0.06]">
      {/* Background Coral Ambient Beams */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(238,77,56,0.2) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ee4d38]/30 bg-[#ee4d38]/10 text-[#ff7d6b] text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(238,77,56,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee4d38] animate-pulse" />
            ENTERPRISE DEPLOYMENT READY
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
            Transform Your Inventory Operations Today
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-xl mx-auto font-normal">
            Join forward-thinking retail, omnichannel, and manufacturing enterprises running smarter supply chains with StockSense.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(238,77,56,0.6)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full bg-[#ee4d38] hover:bg-[#ff5a47] text-white font-bold text-sm uppercase tracking-wide shadow-[0_0_25px_rgba(238,77,56,0.4)] transition-all flex items-center gap-2"
            >
              <span>Request Demo</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all flex items-center gap-3"
            >
              <span>Talk to an Expert</span>
              <div className="w-5 h-5 rounded-full bg-[#0b1120] flex items-center justify-center text-white">
                <MessageSquare className="w-2.5 h-2.5 text-[#ff7d6b]" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

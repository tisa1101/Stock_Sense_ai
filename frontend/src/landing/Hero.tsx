import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
import { DashboardPreview } from './DashboardPreview';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0b1120] pt-24 pb-16">
      {/* Increff-Style Ambient Coral Light Beam at Bottom */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Signature Coral Glow from bottom-left & bottom-center */}
        <div
          className="absolute -bottom-24 left-0 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(238,77,56,0.22) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ee4d38]/30 bg-[#ee4d38]/10 text-[#ff7d6b] text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(238,77,56,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ee4d38] animate-pulse" />
              ✦ ENTERPRISE INVENTORY & MERCHANDISING AI
            </motion.div>

            {/* Main Headline (Increff-style typography) */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6"
            >
              Smart Merchandising &{' '}
              <span className="text-white">
                Omnichannel Fulfillment
              </span>{' '}
              Platforms & Services
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl font-semibold text-slate-200 leading-snug mb-8 max-w-xl"
            >
              Built to Drive Retail Growth, Predict Demand, and Maximize Profitability.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              {/* Increff-style White Pill Button */}
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center justify-between gap-3 px-6 py-3.5 rounded-full bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all"
              >
                <span>Talk to an Expert</span>
                <div className="w-6 h-6 rounded-full bg-[#0b1120] flex items-center justify-center text-white">
                  <MessageSquare className="w-3 h-3 text-[#ff7d6b]" />
                </div>
              </motion.button>

              {/* Increff-style Coral Pill Button */}
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(238,77,56,0.6)' }}
                whileTap={{ scale: 0.97 }}
                className="group px-7 py-3.5 rounded-full bg-[#ee4d38] hover:bg-[#ff5a47] text-white font-bold text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(238,77,56,0.4)] transition-all flex items-center gap-2"
              >
                <span>Request Demo</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Key Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-y-2 gap-x-6 pt-3 border-t border-white/[0.08] w-full"
            >
              {['Sub-10s Multi-Channel Sync', '100% Item Traceability', 'Single Inventory Pool'].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-[#ee4d38] flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Hero Column: 2x2 Interactive Widgets */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 w-full"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

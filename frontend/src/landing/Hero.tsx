import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { DashboardPreview } from './DashboardPreview';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#030712] pt-24 pb-16">
      {/* Background Ambience and Grid */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle high-tech grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Ambient luminous glows */}
        <div className="absolute top-12 left-1/4 w-[650px] h-[650px] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/2 w-[700px] h-[400px] rounded-full bg-cyan-500/10 blur-[140px] -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              ✦ AI-POWERED INVENTORY MANAGEMENT
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              From Data to{' '}
              <span className="block bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]">
                Smarter Decisions
              </span>
            </motion.h1>

            {/* Supporting Pitch */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl font-normal"
            >
              StockSense uses AI to predict demand, optimize inventory, reduce
              waste, and keep your business ahead — in real time.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.03, boxShadow: '0 0 45px rgba(99,102,241,0.6)' }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm tracking-wide uppercase shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all overflow-hidden"
              >
                <span>Get Started Free</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-white font-semibold text-sm hover:border-white/20 hover:bg-white/[0.08] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center group-hover:bg-violet-600/50 transition-colors">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Markers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-y-2 gap-x-6 pt-2 border-t border-white/[0.06] w-full"
            >
              {['No credit card required', 'Setup in minutes', 'Works for any business'].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Hero Column - Interactive 3D Mockup */}
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ChevronRight, Sparkles } from 'lucide-react';

const navLinks = [
  { label: 'Solutions', href: '#solutions', hasDropdown: true },
  { label: 'Industries', href: '#industries', hasDropdown: true },
  { label: 'StockSense AI', href: '#ai-copilot' },
  { label: 'ROI Calculator', href: '#roi-calculator' },
  { label: 'Supply Chain', href: '#supply-chain' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
];

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0b1120]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Increff-style Brand Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                {/* Circular Coral Emblem */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ee4d38] to-[#ff6b5a] flex items-center justify-center shadow-[0_0_20px_rgba(238,77,56,0.5)]">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 22 22 22 12 2" fill="white" stroke="none" opacity="0.9" />
                    <line x1="12" y1="9" x2="12" y2="18" stroke="#ee4d38" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full bg-[#ee4d38] blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-wider flex items-center gap-1.5 font-sans">
                  STOCKSENSE
                </span>
                <span className="text-[9px] text-[#ff7d6b] tracking-widest uppercase font-semibold">
                  Incredible Efficiency
                </span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-70" />}
                </button>
              ))}
            </div>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-xs uppercase tracking-wider font-bold text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </button>
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(238,77,56,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 rounded-full bg-[#ee4d38] hover:bg-[#ff5a47] text-white text-xs font-bold tracking-wide uppercase shadow-[0_0_20px_rgba(238,77,56,0.4)] transition-all flex items-center gap-2"
              >
                <span>Request Demo</span>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </motion.button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav Slideout */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0b1120]/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 xl:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-3.5 text-base font-bold text-slate-300 hover:text-white border-b border-white/[0.06] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.06]">
              <button
                onClick={() => navigate('/login')}
                className="py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-300 font-semibold text-sm text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="py-3.5 rounded-full bg-[#ee4d38] text-white font-bold text-sm tracking-wide uppercase text-center shadow-[0_0_25px_rgba(238,77,56,0.4)]"
              >
                Request Demo →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

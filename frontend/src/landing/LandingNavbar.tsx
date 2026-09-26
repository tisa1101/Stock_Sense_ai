import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, Menu, X, ChevronRight, Sparkles } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'AI Copilot', href: '#ai-copilot' },
  { label: 'Supply Chain', href: '#supply-chain' },
  { label: 'Analytics', href: '#analytics' },
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
            ? 'bg-[#030712]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-[0_0_25px_rgba(99,102,241,0.5)]">
                  <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                    <Layers className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
                  StockSense
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Enterprise Intelligence</span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5 backdrop-blur-md">
              {navLinks.map((link) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                    activeLink === link.href
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {activeLink === link.href && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40"
                      transition={{ type: 'spring', duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </button>
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(99,102,241,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold tracking-wide uppercase shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started Free
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#030712]/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-4 text-lg font-bold text-slate-300 hover:text-white border-b border-white/[0.06] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
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
                className="py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm tracking-wide uppercase text-center shadow-[0_0_25px_rgba(99,102,241,0.4)]"
              >
                Get Started Free →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

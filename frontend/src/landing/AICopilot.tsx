import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, AlertTriangle, ShoppingCart, TrendingDown, Sparkles, Send } from 'lucide-react';

const aiResponse = [
  "Based on current sales velocity, supplier lead time, and historical demand:",
  "",
  "1. Wireless Headphones — 🔴 High Risk",
  "   Estimated stockout: 4 days | Recommended: Reorder 120 units from Acme Corp",
  "",
  "2. USB-C Fast Chargers — 🟡 Medium Risk",
  "   Estimated stockout: 7 days | Recommended: Reorder 80 units",
  "",
  "3. Ergonomic Laptop Stands — 🟢 Healthy",
  "   Estimated stockout: 34 days | Optimal safety stock buffer maintained",
];

export const AICopilot: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [userTyped, setUserTyped] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const userTimer = setTimeout(() => setUserTyped(true), 400);
    const typingTimer = setTimeout(() => setTyping(true), 1200);
    
    let timers: ReturnType<typeof setTimeout>[] = [];
    aiResponse.forEach((line, i) => {
      const t = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
        if (i === aiResponse.length - 1) setTyping(false);
      }, 1600 + i * 160);
      timers.push(t);
    });

    return () => {
      clearTimeout(userTimer);
      clearTimeout(typingTimer);
      timers.forEach(clearTimeout);
    };
  }, [inView]);

  const riskCards = [
    { icon: AlertTriangle, label: 'Wireless Headphones', risk: 'Critical Stockout Risk', days: '4 days', action: 'Reorder 120 units', color: 'rose', conf: 96 },
    { icon: ShoppingCart, label: 'USB-C Fast Chargers', risk: 'Approaching Threshold', days: '7 days', action: 'Reorder 80 units', color: 'amber', conf: 88 },
    { icon: TrendingDown, label: 'Ergonomic Laptop Stands', risk: 'Stable Stock Buffer', days: '34 days', action: 'No action required', color: 'emerald', conf: 94 },
  ];

  const colorMap = {
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', bar: 'bg-rose-500' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', bar: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  };

  return (
    <section id="ai-copilot" ref={ref} className="bg-[#030712] py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold tracking-widest uppercase mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> AI COPILOT
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Meet your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">AI Inventory Copilot.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Interact naturally with your company data. Ask complex queries and receive structured, actionable decisions in seconds.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Chat Terminal Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-[#060810]/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Window header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-violet-400" />
                  </div>
                  <span className="text-white text-xs font-bold">StockSense Copilot — Gemini 2.0 Flash</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-semibold">Live Intelligence</span>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-6 min-h-[300px] flex flex-col gap-4 font-sans">
              {/* User question */}
              {userTyped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-md px-5 py-3.5 rounded-2xl rounded-tr-none bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white text-sm font-medium shadow-lg">
                    Which products are likely to run out next week, and what should we reorder?
                  </div>
                </motion.div>
              )}

              {/* AI Processing Bubble */}
              {typing && displayedLines.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex gap-1.5 items-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-xs text-slate-400 mr-1">Analyzing transaction ledgers...</span>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* AI Response Block */}
              {displayedLines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3.5"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-none p-5">
                    {displayedLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className={`text-xs sm:text-sm ${
                          line.includes('High Risk')
                            ? 'text-rose-400 font-bold'
                            : line.includes('Medium Risk')
                            ? 'text-amber-400 font-bold'
                            : line.includes('Healthy')
                            ? 'text-emerald-400 font-bold'
                            : line.startsWith('   ')
                            ? 'text-slate-400 text-xs pl-2 font-mono'
                            : 'text-slate-200 font-semibold'
                        } ${line === '' ? 'h-2' : 'mb-1'}`}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Prompt input field */}
            <div className="p-4 border-t border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3">
                <input
                  className="flex-1 bg-transparent text-slate-300 text-sm outline-none placeholder-slate-500"
                  placeholder="Ask copilot to forecast, detect anomalies, or generate report..."
                  readOnly
                />
                <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Decision Score Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              Live AI Risk Matrix
            </span>
            {riskCards.map((card, i) => {
              const Icon = card.icon;
              const colors = colorMap[card.color as keyof typeof colorMap];
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className={`rounded-2xl border p-5 ${colors.bg} ${colors.border} backdrop-blur-md`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{card.label}</div>
                        <div className={`text-xs font-semibold ${colors.text}`}>{card.risk}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-base font-extrabold">{card.days}</div>
                      <div className="text-slate-400 text-[10px]">remaining stock</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Prediction Confidence</span>
                      <span className={`font-bold ${colors.text}`}>{card.conf}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${card.conf}%` } : {}}
                        transition={{ delay: 0.6 + i * 0.15, duration: 0.8 }}
                        className={`h-full rounded-full ${colors.bar}`}
                      />
                    </div>
                  </div>

                  <div className={`text-xs font-bold ${colors.text} flex items-center gap-1`}>
                    → {card.action}
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

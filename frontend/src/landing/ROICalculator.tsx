import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ROICalculator: React.FC = () => {
  const [inventoryValue, setInventoryValue] = useState<number>(2500000); // $2.5M
  const [stockoutRate, setStockoutRate] = useState<number>(14); // 14%
  const [excessRate, setExcessRate] = useState<number>(18); // 18%
  const navigate = useNavigate();

  // Calculations
  const recoveredSales = Math.round(inventoryValue * (stockoutRate / 100) * 0.65);
  const capitalReleased = Math.round(inventoryValue * (excessRate / 100) * 0.45);
  const totalAnnualSavings = recoveredSales + capitalReleased;
  const estimatedROI = Math.round((totalAnnualSavings / 48000) * 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="roi-calculator" className="bg-[#030712] py-28 relative overflow-hidden border-t border-white/[0.06]">
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" /> BUSINESS VALUE & ROI CALCULATOR
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Quantify Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">Working Capital Optimization</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            See how much cash flow StockSense AI releases by preventing stockouts and trimming dead inventory.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch rounded-3xl border border-white/[0.08] bg-[#060810]/90 p-8 lg:p-12 backdrop-blur-2xl shadow-2xl">
          {/* Left Inputs */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/[0.06] pb-8 lg:pb-0">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Configure Your Operation Baseline</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-8">Adjust the sliders to reflect your current annual inventory parameters.</p>

              {/* Slider 1: Inventory Value */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-300">Annual Inventory Holding Value</span>
                  <span className="text-sm font-black text-violet-400">{formatCurrency(inventoryValue)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="10000000"
                  step="100000"
                  value={inventoryValue}
                  onChange={(e) => setInventoryValue(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$200K</span>
                  <span>$5M</span>
                  <span>$10M+</span>
                </div>
              </div>

              {/* Slider 2: Stockout Rate */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-300">Estimated Lost Sales / Stockout Rate</span>
                  <span className="text-sm font-black text-rose-400">{stockoutRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  step="1"
                  value={stockoutRate}
                  onChange={(e) => setStockoutRate(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>2% (Low)</span>
                  <span>15% (Typical)</span>
                  <span>35% (Critical)</span>
                </div>
              </div>

              {/* Slider 3: Excess & Dead Stock */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-300">Surplus / Slow-Moving Inventory</span>
                  <span className="text-sm font-black text-amber-400">{excessRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={excessRate}
                  onChange={(e) => setExcessRate(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5%</span>
                  <span>20% (Industry Avg)</span>
                  <span>40%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Calculated based on average 35% forecast error reduction & 25% JIT replenishment cadence.</span>
            </div>
          </div>

          {/* Right Output Projections */}
          <div className="lg:col-span-6 flex flex-col justify-between pl-0 lg:pl-6">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6">
                PROJECTED VALUE REALIZATION
              </div>

              {/* Total Annual Value Box */}
              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-violet-500/10 p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                <div className="text-xs font-bold text-cyan-300 mb-1">TOTAL ESTIMATED ANNUAL VALUE RECOVERED</div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                  {formatCurrency(totalAnnualSavings)}
                  <span className="text-sm text-cyan-400 font-semibold ml-2">/ year</span>
                </div>
                <div className="text-xs text-slate-300">
                  Equivalent to an estimated <span className="text-emerald-400 font-bold">+{estimatedROI}% ROI</span> on implementation investment.
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="text-xs text-slate-400 mb-1">Lost Revenue Prevented</div>
                  <div className="text-2xl font-bold text-emerald-400">{formatCurrency(recoveredSales)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Through proactive reorders</div>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="text-xs text-slate-400 mb-1">Working Capital Unlocked</div>
                  <div className="text-2xl font-bold text-cyan-400">{formatCurrency(capitalReleased)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">By pruning dead stock</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/register')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-bold text-sm uppercase tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
            >
              <span>Unlock This Value — Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    desc: 'Perfect for exploring StockSense.',
    features: ['Up to 50 products', '1 warehouse', 'Basic inventory tracking', 'Email support', '3 report types'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: { monthly: 29, yearly: 23 },
    desc: 'For growing businesses.',
    features: ['Up to 500 products', '3 warehouses', 'AI demand forecasting', 'Smart alerts', 'All report types', 'Priority support'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Business',
    price: { monthly: 79, yearly: 63 },
    desc: 'Full AI intelligence for serious businesses.',
    features: ['Unlimited products', 'Unlimited warehouses', 'AI Copilot', 'Advanced analytics', 'Supplier intelligence', 'API access', 'Dedicated support'],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: { monthly: null, yearly: null },
    desc: 'Custom solutions for large organizations.',
    features: ['Everything in Business', 'Custom integrations', 'SLA guarantees', 'On-premise option', 'Dedicated CSM', 'Custom training'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const Pricing: React.FC = () => {
  const [yearly, setYearly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  return (
    <section id="pricing" ref={ref} className="bg-[#030712] py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/8 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-5">
            ✦ PRICING
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400 text-lg mb-8">No hidden fees. No surprises.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                !yearly ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                yearly ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Yearly
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? 'border border-violet-500/40 bg-gradient-to-b from-violet-500/10 to-indigo-500/5 shadow-[0_0_40px_rgba(139,92,246,0.15)]'
                  : 'border border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-xs">{plan.desc}</p>
              </div>

              <div className="mb-6">
                {plan.price.monthly === null ? (
                  <div className="text-white font-bold text-2xl">Custom</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-extrabold text-3xl">
                      ${yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-slate-500 text-sm">/mo</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'bg-violet-500/20' : 'bg-white/[0.06]'
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlighted ? 'text-violet-400' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-slate-300 text-xs leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => navigate(plan.cta === 'Contact Sales' ? '/contact' : '/register')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]'
                    : 'border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

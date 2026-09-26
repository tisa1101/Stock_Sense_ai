import React from 'react';
import { motion } from 'framer-motion';
import { Database, ShoppingBag, Truck, CreditCard, Cloud, ArrowUpRight, Cpu } from 'lucide-react';

const integrationCategories = [
  {
    category: 'Enterprise ERPs & Databases',
    icon: Database,
    color: '#8b5cf6',
    items: ['SAP S/4HANA', 'Oracle NetSuite', 'Microsoft Dynamics 365', 'SQL Server / PostgreSQL', 'Odoo ERP'],
  },
  {
    category: 'E-Commerce & Marketplaces',
    icon: ShoppingBag,
    color: '#06b6d4',
    items: ['Shopify Plus', 'Amazon Seller Central', 'WooCommerce', 'Magento 2 / Adobe Commerce', 'Flipkart / Mirakl'],
  },
  {
    category: 'Logistics & 3PL Carriers',
    icon: Truck,
    color: '#10b981',
    items: ['FedEx Logistics', 'DHL Express', 'Blue Dart / Delhivery', 'UPS Supply Chain', 'ShipBob / Flexport'],
  },
  {
    category: 'Retail POS & Hardware',
    icon: CreditCard,
    color: '#f59e0b',
    items: ['Zebra Barcode Scanners', 'Square POS', 'Lightspeed', 'Honeywell Terminals', 'Shopify POS'],
  },
];

export const IntegrationsEcosystem: React.FC = () => {
  return (
    <section id="integrations" className="bg-[#030712] py-28 relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
            ✦ PLUG-AND-PLAY CONNECTIVITY
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Seamlessly Integrates with{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Your Entire Tech Stack</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Connect ERPs, e-commerce stores, POS terminals, and freight carriers with bi-directional REST APIs and webhooks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrationCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl flex flex-col justify-between hover:border-violet-500/30 transition-all group"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                    style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-4">{cat.category}</h3>

                  <div className="flex flex-col gap-2.5">
                    {cat.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.04] text-xs text-slate-300 group-hover:border-white/[0.08]"
                      >
                        <span className="font-medium">{item}</span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold" style={{ color: cat.color }}>
                  <span>REST API & Webhooks</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

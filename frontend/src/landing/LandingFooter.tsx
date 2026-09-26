import React from 'react';
import { Layers, Globe, Code2, Share2, ArrowRight } from 'lucide-react';

const footerLinks = [
  {
    title: 'Solutions',
    links: [
      'Demand Forecasting',
      'Merchandise Financial Planning',
      'Allocation & Replenishment',
      'Warehouse Operations (WMS)',
      'Order Orchestration (OMS)',
      'Inter-Warehouse Transfers',
    ],
  },
  {
    title: 'Industries',
    links: [
      'Fashion & Apparel',
      'Electronics & Hardware',
      'Retail & FMCG',
      'Manufacturing & Auto',
      'Third-Party Logistics (3PL)',
      'Consumer Goods',
    ],
  },
  {
    title: 'Resources',
    links: ['ROI Calculators', 'Documentation', 'API Reference', 'Case Studies', 'Knowledge Base', 'System Status'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Partners', 'Security & Compliance', 'Privacy Policy', 'Contact'],
  },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#080d19] border-t border-white/[0.08] pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ee4d38] to-[#ff6b5a] flex items-center justify-center shadow-[0_0_20px_rgba(238,77,56,0.4)]">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 2 22 22 22 12 2" fill="white" stroke="none" opacity="0.9" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-wider">STOCKSENSE</span>
                <span className="text-[9px] text-[#ff7d6b] uppercase font-bold tracking-widest">Incredible Efficiency</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              AI-driven SaaS for intelligent retail merchandising, inventory optimization, and omnichannel supply chain execution.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/tisa1101/Stock_Sense_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#ee4d38] hover:bg-[#ee4d38]/10 transition-all"
                title="GitHub Repository"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#ee4d38] hover:bg-[#ee4d38]/10 transition-all"
                title="Global Network"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#ee4d38] hover:bg-[#ee4d38]/10 transition-all"
                title="Community"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="col-span-1">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 pb-1 border-b border-white/[0.06]">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            © 2026 StockSense Technologies Inc. Built for Hackathon 2026 • Contributed by khushi-0308 & Team.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-xs font-semibold">All Systems Operational & Synced</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

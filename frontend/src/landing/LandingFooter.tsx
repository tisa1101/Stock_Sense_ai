import React from 'react';
import { Layers, Globe, Code2, Share2 } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Analytics', 'AI Insights', 'Integrations', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Careers', 'Partners', 'Blog'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Guides', 'Help Center', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Security', 'Cookies'],
  },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#030712] border-t border-white/[0.06] pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">StockSense</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered inventory intelligence for modern businesses.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/tisa1101/Stock_Sense_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                title="GitHub Repository"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                title="Global Network"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                title="Community"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 StockSense. Built for Hackathon 2026 • Team StockSense.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-500 text-xs">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

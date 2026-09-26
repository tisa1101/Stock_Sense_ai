import React, { useEffect } from 'react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { Hero } from '../landing/Hero';
import { Metrics } from '../landing/Metrics';
import { ProblemSolution } from '../landing/ProblemSolution';
import { FeatureGrid } from '../landing/FeatureGrid';
import { AICopilot } from '../landing/AICopilot';
import { HowItWorks } from '../landing/HowItWorks';
import { SupplyChain } from '../landing/SupplyChain';
import { AnalyticsPreview } from '../landing/AnalyticsPreview';
import { BeforeAfter } from '../landing/BeforeAfter';
import { Pricing } from '../landing/Pricing';
import { CTASection } from '../landing/CTASection';
import { LandingFooter } from '../landing/LandingFooter';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Force dark background for landing page
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#030712';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <LandingNavbar />
      <Hero />
      <Metrics />
      <ProblemSolution />
      <FeatureGrid />
      <AICopilot />
      <HowItWorks />
      <SupplyChain />
      <AnalyticsPreview />
      <BeforeAfter />
      <Pricing />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

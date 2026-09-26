import React, { useEffect } from 'react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { Hero } from '../landing/Hero';
import { Metrics } from '../landing/Metrics';
import { SolutionMatrix } from '../landing/SolutionMatrix';
import { ROICalculator } from '../landing/ROICalculator';
import { ProblemSolution } from '../landing/ProblemSolution';
import { FeatureGrid } from '../landing/FeatureGrid';
import { IndustrySolutions } from '../landing/IndustrySolutions';
import { AICopilot } from '../landing/AICopilot';
import { HowItWorks } from '../landing/HowItWorks';
import { SupplyChain } from '../landing/SupplyChain';
import { IntegrationsEcosystem } from '../landing/IntegrationsEcosystem';
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
      <SolutionMatrix />
      <ROICalculator />
      <ProblemSolution />
      <FeatureGrid />
      <IndustrySolutions />
      <AICopilot />
      <HowItWorks />
      <SupplyChain />
      <IntegrationsEcosystem />
      <AnalyticsPreview />
      <BeforeAfter />
      <Pricing />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

'use client';

import Hero from '../components/landing/Hero';
import ProblemStatement from '../components/landing/ProblemStatement';
import HowItWorks from '../components/landing/Methods';
import KeyFeatures from '../components/landing/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="space-y-0">
        <ProblemStatement />
        <HowItWorks />
        <KeyFeatures />
      </div>
      <Footer />
    </div>
  );
}

'use client';

import React from 'react';
import SamplePortfolioTemplate from './SamplePortfolioTemplate';
import { samplePortfolioData } from '../lib/sample-portfolio-data';

interface SamplePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate?: () => void;
}

export default function SamplePortfolioModal({ isOpen, onClose, onUseTemplate }: SamplePortfolioModalProps) {
  if (!isOpen) return null;

  // Convert sample data to the format expected by SamplePortfolioTemplate
  const portfolioData = {
    name: samplePortfolioData.name,
    email: samplePortfolioData.email,
    phone: samplePortfolioData.phone,
    linkedin_url: samplePortfolioData.linkedin_url,
    github_url: samplePortfolioData.github_url,
    summary: samplePortfolioData.summary,
    skills: samplePortfolioData.skills,
    experiences: samplePortfolioData.experiences.map(exp => ({
      role: exp.role,
      company: exp.company,
      dates: exp.dates,
      responsibilities: exp.responsibilities
    })),
    education: samplePortfolioData.education.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      dates: edu.dates
    })),
    projects: samplePortfolioData.projects.map(proj => ({
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies
    }))
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
      <div className="relative bg-gray-900 w-full h-full flex flex-col">
        {/* Header with Close Button */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Sample Portfolio Template Preview</h2>
            <p className="text-gray-400 text-sm">See how your portfolio could look with this template</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Portfolio Content - Scrollable */}
        <div className="flex-1 overflow-auto">
          <SamplePortfolioTemplate data={portfolioData} isPreview={false} />
        </div>

        {/* Footer with Action Buttons - Always Visible */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-gray-700/50 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-400">
            This is a live preview with sample data. Your actual portfolio will use your information.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                onClose();
                onUseTemplate?.();
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
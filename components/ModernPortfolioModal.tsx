'use client';

import React from 'react';
import ModernPortfolioTemplate from './ModernPortfolioTemplate';
import { samplePortfolioData } from '../lib/sample-portfolio-data';

interface ModernPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate?: () => void;
}

export default function ModernPortfolioModal({ isOpen, onClose, onUseTemplate }: ModernPortfolioModalProps) {
  if (!isOpen) return null;

  // Convert sample data to the format expected by ModernPortfolioTemplate
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
      <div className="relative bg-white w-full h-full flex flex-col">
        {/* Header with Close Button */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Modern Professional Template Preview</h2>
            <p className="text-gray-600 text-sm">See how your portfolio could look with this template</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Portfolio Content - Scrollable */}
        <div className="flex-1 overflow-auto">
          <ModernPortfolioTemplate data={portfolioData} isPreview={false} />
        </div>

        {/* Footer with Action Buttons - Always Visible */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            This is a live preview with sample data. Your actual portfolio will use your information.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                onClose();
                onUseTemplate?.();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
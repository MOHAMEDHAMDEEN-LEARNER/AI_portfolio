'use client';

import React from 'react';
import ModernPortfolioTemplate from './ModernPortfolioTemplate';
import { samplePortfolioData } from '../lib/sample-portfolio-data';

export default function ModernPortfolioPreview() {
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
    <div className="w-full h-48 bg-white overflow-hidden rounded-lg relative border border-slate-200">
      <div className="scale-[0.15] origin-top-left w-[667%] h-[667%] -ml-2 -mt-2">
        <ModernPortfolioTemplate data={portfolioData} isPreview={true} />
      </div>
      
      {/* Overlay with template info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-3 text-white">
        <div className="text-xs font-bold text-blue-300">Modern Professional</div>
        <div className="text-xs opacity-90">Contemporary Design</div>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import SamplePortfolioTemplate from './SamplePortfolioTemplate';
import ModernPortfolioTemplate from './ModernPortfolioTemplate';

interface SectionData {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  order: number;
  visible: boolean;
  data: Record<string, unknown>[];
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
}

interface PortfolioData {
  template: string;
  personalInfo: PersonalInfo;
  sections: SectionData[];
}

interface LivePreviewProps {
  portfolioData: PortfolioData;
  template: string;
}

export default function LivePreview({ portfolioData, template }: LivePreviewProps) {
  // Convert our portfolio data to the format expected by the templates
  const convertToTemplateData = () => {
    const experienceSection = portfolioData.sections.find(s => s.type === 'experience');
    const educationSection = portfolioData.sections.find(s => s.type === 'education');
    const skillsSection = portfolioData.sections.find(s => s.type === 'skills');
    const projectsSection = portfolioData.sections.find(s => s.type === 'projects');

    return {
      name: portfolioData.personalInfo.name || 'Your Name',
      email: portfolioData.personalInfo.email || 'your.email@example.com',
      phone: portfolioData.personalInfo.phone || '+1 (555) 123-4567',
      linkedin_url: portfolioData.personalInfo.linkedin || '',
      github_url: portfolioData.personalInfo.github || '',
      website_url: portfolioData.personalInfo.website || '',
      location: portfolioData.personalInfo.location || 'Your Location',
      summary: portfolioData.personalInfo.summary || 'Professional summary will appear here as you type...',
      
      experiences: experienceSection?.data.map((exp: any) => ({
        role: exp.role || 'Job Title',
        company: exp.company || 'Company Name',
        dates: exp.current ? 
          `${exp.startDate || 'Start Date'} - Present` : 
          `${exp.startDate || 'Start Date'} - ${exp.endDate || 'End Date'}`,
        responsibilities: exp.description ? [exp.description] : ['Job responsibilities and achievements will appear here...']
      })) || [
        {
          role: 'Add your work experience',
          company: 'Company Name',
          dates: 'Start Date - End Date',
          responsibilities: ['Click on the Experience tab to add your work history']
        }
      ],
      
      education: educationSection?.data.map((edu: any) => ({
        degree: edu.degree || 'Degree Name',
        institution: edu.institution || 'Institution Name',
        dates: `${edu.startDate || 'Start'} - ${edu.endDate || 'End'}`,
        gpa: edu.gpa || ''
      })) || [
        {
          degree: 'Add your education',
          institution: 'Institution Name',
          dates: 'Start - End',
          gpa: ''
        }
      ],
      
      skills: skillsSection?.data.map((skill: any) => skill.name || 'Skill Name').filter(Boolean) || [
        'Add your skills in the Skills tab'
      ],
      
      projects: projectsSection?.data.map((project: any) => ({
        name: project.name || 'Project Name',
        description: project.description || 'Project description will appear here...',
        technologies: project.technologies ? project.technologies.split(',').map((t: string) => t.trim()) : ['Technology'],
        github: project.github || '',
        demo: project.demo || ''
      })) || [
        {
          name: 'Add your projects',
          description: 'Click on the Projects tab to showcase your work',
          technologies: ['Technology Stack'],
          github: '',
          demo: ''
        }
      ]
    };
  };

  const templateData = convertToTemplateData();

  const renderTemplate = () => {
    switch (template) {
      case 'aesthetic-portfolio':
        return <SamplePortfolioTemplate data={templateData} isPreview={true} />;
      case 'modern-professional':
        return <ModernPortfolioTemplate data={templateData} isPreview={true} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Template Preview</h3>
              <p className="text-gray-600">Selected template: {template}</p>
              <p className="text-sm text-gray-500 mt-2">Preview will appear here as you fill in your information</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-100 relative">
      {/* Browser Window Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex-1 mx-4">
          <div className="bg-gray-700 rounded px-3 py-1 text-sm text-gray-300 text-center">
            {portfolioData.personalInfo.name ? 
              `${portfolioData.personalInfo.name.toLowerCase().replace(/\\s+/g, '')}.portfolio.com` : 
              'your-portfolio.com'
            }
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Portfolio Preview Content */}
      <div className="h-[calc(100%-56px)] overflow-y-auto bg-white">
        {renderTemplate()}
      </div>

      {/* Preview Overlay for Interaction Prevention */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-14 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          Live Preview
        </div>
      </div>
    </div>
  );
}
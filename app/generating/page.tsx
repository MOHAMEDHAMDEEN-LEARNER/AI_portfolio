'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../lib/auth-guard';
import { useAuth } from '../../lib/auth-context';
import { PortfolioService } from '../../lib/portfolio-service';
import SamplePortfolioTemplate from '../../components/SamplePortfolioTemplate';
import ModernPortfolioTemplate from '../../components/ModernPortfolioTemplate';

interface ExperienceData {
  role: string;
  company: string;
  dates: string;
  responsibilities: string[];
}

interface EducationData {
  degree: string;
  institution: string;
  dates: string;
}

interface ProjectData {
  name: string;
  description: string;
  technologies: string[];
}

interface PortfolioData {
  name: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  summary: string;
  skills: string[];
  experiences: ExperienceData[];
  education: EducationData[];
  projects: ProjectData[];
}

export default function GeneratingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const selectedTemplate = searchParams.get('template') || 'aesthetic-portfolio';
  
  // Template change handler
  const handleTemplateChange = (newTemplate: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('template', newTemplate);
    router.push(url.pathname + url.search);
  };
  
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Portfolio form data state
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    phone: '',
    linkedin_url: searchParams.get('linkedin') || '',
    github_url: searchParams.get('github') || '',
    summary: searchParams.get('additionalInfo') || '',
    skills: [],
    experiences: [],
    education: [],
    projects: []
  });

  // Load existing portfolio data if available
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (user?.id) {
        try {
          const existingData = await PortfolioService.getPortfolioByUserId(user.id);
          if (existingData) {
            setPortfolioData(prevData => ({
              name: existingData.name || prevData.name,
              email: existingData.email || prevData.email,
              phone: existingData.phone || prevData.phone,
              linkedin_url: existingData.linkedin_url || prevData.linkedin_url,
              github_url: existingData.github_url || prevData.github_url,
              summary: existingData.summary || prevData.summary,
              skills: existingData.skills || [],
              experiences: existingData.experiences || [],
              education: existingData.education || [],
              projects: existingData.projects || []
            }));
          }
        } catch (error) {
          console.log('No existing portfolio data found, using default:', error);
        }
      }
    };
    loadPortfolioData();
  }, [user?.id]);

  // Auto-save to database when data changes
  const saveToDatabase = async (updatedData: PortfolioData) => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      // Check if portfolio exists, if not create it
      const existingPortfolio = await PortfolioService.getPortfolioByUserId(user.id);
      
      if (existingPortfolio) {
        // Update existing portfolio
        await PortfolioService.updatePortfolio(existingPortfolio.id, {
          ...updatedData,
          template_id: selectedTemplate
        });
      } else {
        // Create new portfolio
        await PortfolioService.createPortfolio(user.id, {
          ...updatedData,
          template_id: selectedTemplate,
          status: 'completed'
        });
      }
    } catch (error) {
      console.error('Failed to save portfolio data:', error);
    }
    setIsSaving(false);
  };

  // Handle form input changes with auto-save
  const handleInputChange = (field: keyof PortfolioData, value: string | string[] | ExperienceData[] | EducationData[] | ProjectData[]) => {
    const updatedData = {
      ...portfolioData,
      [field]: value
    };
    setPortfolioData(updatedData);
    
    // Auto-save to database
    saveToDatabase(updatedData);
  };

  // Add new experience
  const addExperience = () => {
    const newExperience: ExperienceData = {
      role: '',
      company: '',
      dates: '',
      responsibilities: ['']
    };
    const updatedExperiences = [...portfolioData.experiences, newExperience];
    handleInputChange('experiences', updatedExperiences);
  };

  // Update experience
  const updateExperience = (index: number, field: keyof ExperienceData, value: string | string[]) => {
    const updatedExperiences = [...portfolioData.experiences];
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
    handleInputChange('experiences', updatedExperiences);
  };

  // Add new education
  const addEducation = () => {
    const newEducation: EducationData = {
      degree: '',
      institution: '',
      dates: ''
    };
    const updatedEducation = [...portfolioData.education, newEducation];
    handleInputChange('education', updatedEducation);
  };

  // Update education
  const updateEducation = (index: number, field: keyof EducationData, value: string) => {
    const updatedEducation = [...portfolioData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    handleInputChange('education', updatedEducation);
  };

  // Add new skill
  const addSkill = (skill: string) => {
    if (skill.trim() && !portfolioData.skills.includes(skill.trim())) {
      const updatedSkills = [...portfolioData.skills, skill.trim()];
      handleInputChange('skills', updatedSkills);
    }
  };

  // Remove skill
  const removeSkill = (index: number) => {
    const updatedSkills = portfolioData.skills.filter((_, i) => i !== index);
    handleInputChange('skills', updatedSkills);
  };

  const handleFullScreenPreview = () => {
    setShowFullScreen(true);
  };

  // Template rendering function
  const renderTemplate = (isPreview: boolean = false) => {
    const templateProps = { data: portfolioData, isPreview };
    
    switch (selectedTemplate) {
      case 'modern-professional':
        return <ModernPortfolioTemplate {...templateProps} />;
      case 'aesthetic-portfolio':
      default:
        return <SamplePortfolioTemplate {...templateProps} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back to Templates Button */}
              <button
                onClick={() => router.push('/generate')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Templates
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Builder</h1>
                <p className="text-gray-600">Customize your {selectedTemplate} template</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Template Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="template-select" className="text-sm font-medium text-gray-700">Template:</label>
                <select
                  id="template-select"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="aesthetic-portfolio">Aesthetic Portfolio</option>
                  <option value="modern-professional">Modern Professional</option>
                </select>
              </div>
              <button
                onClick={() => {
                  // Validate required fields
                  if (!portfolioData.name || !portfolioData.email) {
                    alert('Please fill in your name and email before deploying.');
                    return;
                  }
                  
                  // Navigate to deploy page with portfolio data
                  const params = new URLSearchParams({
                    template: selectedTemplate,
                    name: portfolioData.name,
                    email: portfolioData.email,
                    phone: portfolioData.phone,
                    linkedin_url: portfolioData.linkedin_url,
                    github_url: portfolioData.github_url,
                    summary: portfolioData.summary,
                    skills: portfolioData.skills.join(',')
                  });
                  
                  router.push(`/deploy?${params.toString()}`);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                Deploy Portfolio
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Panel - Form Builder */}
          <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Information</h3>
                {isSaving && (
                  <span className="text-sm text-blue-600 flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                )}
              </div>
              
              {/* Personal Information Section */}
              <div className="space-y-6 mb-8">
                <h4 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                      value={portfolioData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                      value={portfolioData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                      value={portfolioData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <input
                      id="linkedin"
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/johndoe"
                      value={portfolioData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                    <input
                      id="github"
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/johndoe"
                      value={portfolioData.github_url}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    id="summary"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your professional background and goals..."
                    value={portfolioData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-6 mb-8">
                <h4 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">Skills</h4>
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {portfolioData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          addSkill(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                        addSkill(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="text-md font-medium text-gray-800">Work Experience</h4>
                  <button
                    onClick={addExperience}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    + Add Experience
                  </button>
                </div>
                {portfolioData.experiences.map((experience, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Job Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={experience.role}
                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={experience.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Employment Dates (e.g., 2020 - 2023)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={experience.dates}
                        onChange={(e) => updateExperience(index, 'dates', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities (one per line)</label>
                      <textarea
                        rows={4}
                        placeholder="• Key responsibility 1&#10;• Key responsibility 2&#10;• Key responsibility 3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={experience.responsibilities.join('\n')}
                        onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n').filter(r => r.trim()))}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education Section */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="text-md font-medium text-gray-800">Education</h4>
                  <button
                    onClick={addEducation}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    + Add Education
                  </button>
                </div>
                {portfolioData.education.map((education, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Degree"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={education.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Institution"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={education.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Dates (e.g., 2016 - 2020)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={education.dates}
                      onChange={(e) => updateEducation(index, 'dates', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="w-1/2 bg-gray-900 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700/50 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 text-sm">your-portfolio.com</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleFullScreenPreview}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Full Screen
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    Live Preview
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                {renderTemplate(true)}
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Preview Modal */}
        {showFullScreen && (
          <div className="fixed inset-0 bg-black z-50 flex">
            <div className="relative w-full h-full flex flex-col">
              {/* Header with Close Button */}
              <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-white">Portfolio Preview</h2>
                  <p className="text-gray-400 text-sm">Full screen preview of your {selectedTemplate} template</p>
                </div>
                <button
                  onClick={() => setShowFullScreen(false)}
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
                {renderTemplate(false)}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
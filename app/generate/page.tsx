'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import { ProtectedRoute } from '../../lib/auth-guard';
import { useAuth } from '../../lib/auth-context';
import AuthDebugger from '../../components/ui/AuthDebugger';
import { AuthUtils } from '../../lib/auth-utils';
import SamplePortfolioModal from '../../components/SamplePortfolioModalNew';
import ModernPortfolioModal from '../../components/ModernPortfolioModal';
import { PortfolioService } from '../../lib/portfolio-service';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  bestFor: string[];
  isAvailable: boolean; // Flag to indicate if template is fully implemented
}

// All templates - organized for easy expansion with available and upcoming templates
const templates: Template[] = [
  {
    id: 'aesthetic-portfolio',
    name: 'Aesthetic Portfolio',
    description: 'A complete portfolio example based on real data - see how your portfolio could look.',
    category: 'Professional',
    preview: '/image copy 3.png', // Use proper image preview like other templates
    features: ['Live Preview', 'Real Data', 'Dark Theme', 'Mobile Responsive'],
    bestFor: ['All Professionals', 'First-time Users', 'Quick Start', 'Portfolio Beginners'],
    isAvailable: true
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Contemporary design with elegant layout, perfect for showcasing professional experience and projects.',
    category: 'Professional',
    preview: '/image copy 2.png',
    features: ['Contemporary Design', 'Project Showcase', 'Skills Display', 'Contact Integration'],
    bestFor: ['UX/UI Designers', 'Developers', 'Creative Professionals'],
    isAvailable: true
  },
  // Upcoming Creative Templates
  {
    id: 'artistic-showcase',
    name: 'Artistic Showcase',
    description: 'Vibrant and creative design perfect for artists, designers, and creative professionals.',
    category: 'Creative',
    preview: '/placeholder-creative.png',
    features: ['Gallery Focus', 'Animation Effects', 'Color Themes', 'Creative Layouts'],
    bestFor: ['Artists', 'Graphic Designers', 'Photographers', 'Creative Directors'],
    isAvailable: false
  },
  {
    id: 'minimal-creative',
    name: 'Minimal Creative',
    description: 'Clean and minimalist approach to showcase creative work with elegant typography.',
    category: 'Creative',
    preview: '/placeholder-minimal.png',
    features: ['Minimal Design', 'Typography Focus', 'Clean Layouts', 'Portfolio Grid'],
    bestFor: ['UI/UX Designers', 'Web Designers', 'Creative Writers'],
    isAvailable: false
  },
  // Upcoming Business Templates
  {
    id: 'executive-professional',
    name: 'Executive Professional',
    description: 'Corporate-focused design ideal for executives, consultants, and business leaders.',
    category: 'Business',
    preview: '/placeholder-business.png',
    features: ['Corporate Design', 'Achievement Focus', 'Leadership Display', 'Professional Metrics'],
    bestFor: ['Executives', 'Consultants', 'Business Leaders', 'Sales Professionals'],
    isAvailable: false
  },
  // Upcoming Technology Templates
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    description: 'Modern tech-focused design with code snippets and project demonstrations.',
    category: 'Technology',
    preview: '/placeholder-tech.png',
    features: ['Code Integration', 'Tech Stack Display', 'Project Demos', 'GitHub Integration'],
    bestFor: ['Software Engineers', 'DevOps Engineers', 'Tech Leads', 'Full-Stack Developers'],
    isAvailable: false
  },
  // Upcoming Academic Templates
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Scholarly design perfect for researchers, professors, and academic professionals.',
    category: 'Academic',
    preview: '/placeholder-academic.png',
    features: ['Publication Lists', 'Research Focus', 'Academic Achievements', 'Citation Display'],
    bestFor: ['Researchers', 'Professors', 'PhD Students', 'Academic Professionals'],
    isAvailable: false
  },
  // Upcoming Entrepreneurial Templates
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    description: 'Dynamic design showcasing entrepreneurial journey and business achievements.',
    category: 'Entrepreneurial',
    preview: '/placeholder-startup.png',
    features: ['Startup Story', 'Business Metrics', 'Investor Ready', 'Growth Timeline'],
    bestFor: ['Entrepreneurs', 'Startup Founders', 'Business Owners', 'Investors'],
    isAvailable: false
  }
];

export default function GeneratePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSampleModal, setShowSampleModal] = useState<boolean>(false);
  const [showModernModal, setShowModernModal] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    resume: null as File | null,
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    additionalInfo: ''
  });

  // Check for existing portfolio data when component mounts
  useEffect(() => {
    const checkExistingData = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const existingPortfolio = await PortfolioService.getPortfolioByUserId(user.id);
        if (existingPortfolio && (existingPortfolio.name || existingPortfolio.skills?.length > 0)) {
          setHasExistingData(true);
          // Pre-populate form data from existing portfolio
          setFormData(prev => ({
            ...prev,
            githubUrl: existingPortfolio.github_url || '',
            linkedinUrl: existingPortfolio.linkedin_url || '',
            additionalInfo: existingPortfolio.summary || ''
          }));
        }
      } catch (error) {
        console.log('No existing portfolio data found:', error);
      }
    };

    checkExistingData();
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('SignOut error in Generate page:', error);
      // Force logout as fallback
      AuthUtils.forceLogout();
    }
  };

  // Filter templates - show all for browsing, but only available can be selected
  const allTemplates = templates;

  // All available categories - keep all categories visible even without templates
  const categories = ['All', 'Professional', 'Creative', 'Business', 'Technology', 'Academic', 'Entrepreneurial'];

  const filteredTemplates = selectedCategory === 'All' 
    ? allTemplates 
    : allTemplates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // If user has existing data, show option to skip form
    if (hasExistingData) {
      // For now, still show the form but with a skip option
      // We'll add a "Skip to Builder" button in the form
    }
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Redirect to upload resume page with selected template
    router.push(`/upload-resume?template=${encodeURIComponent(templateId)}`);
  };

  const handleContinue = () => {
    if (selectedTemplate === 'aesthetic-portfolio') {
      // Open the aesthetic portfolio modal
      setShowSampleModal(true);
      return;
    }
    
    if (selectedTemplate === 'modern-professional') {
      // Open the modern portfolio modal
      setShowModernModal(true);
      return;
    }
    
    if (selectedTemplate) {
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to generate a portfolio.');
      return;
    }

    // Navigate to the generating page with the selected template
    const params = new URLSearchParams({
      template: selectedTemplate || 'aesthetic-portfolio',
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      linkedin: formData.linkedinUrl || '',
      github: formData.githubUrl || '',
      additionalInfo: formData.additionalInfo || ''
    });

    window.location.href = `/generating?${params.toString()}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/image.png"
                alt="AI Portfolio Generator Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-gray-900 font-bold text-xl">AI Portfolio</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium hidden md:block">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                Sign Out
              </Button>
              <AuthDebugger />
            </div>
          </div>
        </div>
      </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Choose Your Portfolio Template
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Select a template that best represents your professional style. Our AI will
                customize it with your information to create a stunning portfolio.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                    template.isAvailable 
                      ? `cursor-pointer hover:shadow-xl hover:scale-105 ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 ring-4 ring-blue-100'
                            : 'border-gray-200 hover:border-blue-300'
                        }`
                      : 'opacity-75 border-gray-200 cursor-not-allowed'
                  }`}
                  onClick={() => template.isAvailable && handleTemplateSelect(template.id)}
                >
                  {/* Template Preview - Organized rendering */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    {template.isAvailable ? (
                      <Image
                        src={template.preview}
                        alt={`${template.name} template preview`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-3 mx-auto">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">Coming Soon</p>
                        </div>
                      </div>
                    )}
                    
                    {template.isAvailable && selectedTemplate === template.id && (
                      <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {!template.isAvailable && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          Coming Soon
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-xl font-bold ${template.isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {template.category}
                        </span>
                        {!template.isAvailable && (
                          <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className={`mb-4 ${template.isAvailable ? 'text-gray-600' : 'text-gray-500'}`}>
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className={`text-sm font-semibold mb-2 ${template.isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                        Features:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map(feature => (
                          <span
                            key={feature}
                            className={`text-xs px-2 py-1 rounded ${
                              template.isAvailable 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'bg-gray-50 text-gray-500'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Best For */}
                    <div className="mb-4">
                      <h4 className={`text-sm font-semibold mb-2 ${template.isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                        Best for:
                      </h4>
                      <p className={`text-sm ${template.isAvailable ? 'text-gray-600' : 'text-gray-500'}`}>
                        {template.bestFor.join(', ')}
                      </p>
                    </div>

                    {/* Preview Buttons for Available Templates */}
                    {template.isAvailable && (
                      <>
                        {/* Special Preview Button for Aesthetic Portfolio */}
                        {template.id === 'aesthetic-portfolio' && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSampleModal(true);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Preview Full Portfolio
                            </button>
                          </div>
                        )}

                        {/* Special Preview Button for Modern Professional Portfolio */}
                        {template.id === 'modern-professional' && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowModernModal(true);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Preview Full Portfolio
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Coming Soon Message for Unavailable Templates */}
                    {!template.isAvailable && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center py-3">
                          <p className="text-sm text-gray-500 font-medium">
                            This template is under development
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Available soon
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button - Only show for available templates */}
            {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.isAvailable && (
              <div className="text-center">
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {selectedTemplate === 'aesthetic-portfolio' 
                    ? 'View Full Aesthetic Portfolio' 
                    : `Continue with ${templates.find(t => t.id === selectedTemplate)?.name}`
                  }
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Portfolio Generation Form */
          <div className="max-w-4xl mx-auto">
            {/* Form Header */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowForm(false)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Templates
              </button>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Generate Your Portfolio
              </h1>
              <p className="text-xl text-gray-600">
                Selected Template: <span className="font-semibold text-blue-600">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </span>
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {hasExistingData && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Portfolio Data Found!</h3>
                      <p className="text-green-700">We found your existing portfolio data. You can skip the form and go directly to customize your new template.</p>
                    </div>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams({
                          template: selectedTemplate || 'aesthetic-portfolio',
                          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
                          email: user?.email || '',
                          linkedin: formData.linkedinUrl || '',
                          github: formData.githubUrl || '',
                          additionalInfo: formData.additionalInfo || ''
                        });
                        window.location.href = `/generating?${params.toString()}`;
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Skip to Builder →
                    </button>
                  </div>
                  <hr className="my-4 border-green-200" />
                  <p className="text-sm text-green-600">Or fill out the form below to update your information:</p>
                </div>
              )}
              
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Resume Upload */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Upload Your Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                      </p>
                      <p className="text-gray-600">
                        Supports PDF, DOC, and DOCX files
                      </p>
                    </label>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="githubUrl" className="block text-lg font-semibold text-gray-900 mb-3">
                      GitHub URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedinUrl" className="block text-lg font-semibold text-gray-900 mb-3">
                      LinkedIn URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label htmlFor="additionalInfo" className="block text-lg font-semibold text-gray-900 mb-3">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your career goals, special achievements, or any specific information you'd like to highlight..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Generate My Portfolio
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* Modals */}
      {showSampleModal && (
        <SamplePortfolioModal 
          isOpen={showSampleModal}
          onClose={() => setShowSampleModal(false)}
          onUseTemplate={() => handleUseTemplate('aesthetic-portfolio')}
        />
      )}

      {showModernModal && (
        <ModernPortfolioModal 
          isOpen={showModernModal}
          onClose={() => setShowModernModal(false)}
          onUseTemplate={() => handleUseTemplate('modern-professional')}
        />
      )}
    </ProtectedRoute>
  );
}
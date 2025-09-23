'use client';

import React, { useState } from 'react';

interface ExperienceData {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface SkillData {
  name: string;
  level: string;
  category: string;
}

interface SectionData {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  order: number;
  visible: boolean;
  data: (ExperienceData | SkillData | Record<string, string>)[];
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

interface PortfolioBuilderProps {
  portfolioData: PortfolioData;
  onDataUpdate: (data: Partial<PortfolioData>) => void;
  onSectionReorder: (sections: SectionData[]) => void;
}

export default function PortfolioBuilder({ portfolioData, onDataUpdate, onSectionReorder }: PortfolioBuilderProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    onDataUpdate({
      personalInfo: {
        ...portfolioData.personalInfo,
        [field]: value
      }
    });
  };

  const handleSectionDataChange = (sectionId: string, index: number, field: string, value: string | boolean) => {
    const updatedSections = portfolioData.sections.map(section => {
      if (section.id === sectionId) {
        const updatedData = [...section.data];
        updatedData[index] = { ...updatedData[index], [field]: value };
        return { ...section, data: updatedData };
      }
      return section;
    });
    onDataUpdate({ sections: updatedSections });
  };

  const addSectionItem = (sectionId: string) => {
    const section = portfolioData.sections.find(s => s.id === sectionId);
    if (!section) return;

    let newItem: ExperienceData | SkillData | Record<string, string> = {};
    
    switch (section.type) {
      case 'experience':
        newItem = { 
          role: '', 
          company: '', 
          startDate: '', 
          endDate: '', 
          current: false, 
          description: '' 
        } as ExperienceData;
        break;
      case 'education':
        newItem = { 
          degree: '', 
          institution: '', 
          startDate: '', 
          endDate: '', 
          gpa: '', 
          description: '' 
        };
        break;
      case 'skills':
        newItem = { 
          name: '', 
          level: 'Intermediate', 
          category: 'Technical' 
        } as SkillData;
        break;
      case 'projects':
        newItem = { 
          name: '', 
          description: '', 
          technologies: '', 
          github: '', 
          demo: '', 
          startDate: '', 
          endDate: '' 
        };
        break;
      case 'certifications':
        newItem = { 
          name: '', 
          issuer: '', 
          date: '', 
          expiry: '', 
          credentialId: '' 
        };
        break;
    }

    const updatedSections = portfolioData.sections.map(s => 
      s.id === sectionId ? { ...s, data: [...s.data, newItem] } : s
    );
    onDataUpdate({ sections: updatedSections });
  };

  const removeSectionItem = (sectionId: string, index: number) => {
    const updatedSections = portfolioData.sections.map(section => {
      if (section.id === sectionId) {
        const updatedData = section.data.filter((_, i) => i !== index);
        return { ...section, data: updatedData };
      }
      return section;
    });
    onDataUpdate({ sections: updatedSections });
  };

  const moveSectionUp = (sectionId: string) => {
    const currentIndex = portfolioData.sections.findIndex(s => s.id === sectionId);
    if (currentIndex > 0) {
      const newSections = [...portfolioData.sections];
      [newSections[currentIndex - 1], newSections[currentIndex]] = 
      [newSections[currentIndex], newSections[currentIndex - 1]];
      
      // Update order numbers
      const reorderedSections = newSections.map((section, index) => ({
        ...section,
        order: index + 1
      }));
      
      onSectionReorder(reorderedSections);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const currentIndex = portfolioData.sections.findIndex(s => s.id === sectionId);
    if (currentIndex < portfolioData.sections.length - 1) {
      const newSections = [...portfolioData.sections];
      [newSections[currentIndex], newSections[currentIndex + 1]] = 
      [newSections[currentIndex + 1], newSections[currentIndex]];
      
      // Update order numbers
      const reorderedSections = newSections.map((section, index) => ({
        ...section,
        order: index + 1
      }));
      
      onSectionReorder(reorderedSections);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            id="name"
            type="text"
            value={portfolioData.personalInfo.name}
            onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={portfolioData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            id="phone"
            type="tel"
            value={portfolioData.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            id="location"
            type="text"
            value={portfolioData.personalInfo.location}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="New York, NY"
          />
        </div>
        
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
          <input
            id="linkedin"
            type="url"
            value={portfolioData.personalInfo.linkedin}
            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
        
        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
          <input
            id="github"
            type="url"
            value={portfolioData.personalInfo.github}
            onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://github.com/johndoe"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
        <input
          id="website"
          type="url"
          value={portfolioData.personalInfo.website}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://johndoe.com"
        />
      </div>
      
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
        <textarea
          id="summary"
          value={portfolioData.personalInfo.summary}
          onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Brief description of your professional background and goals..."
        />
      </div>
    </div>
  );

  const renderSectionEditor = (section: SectionData) => {
    switch (section.type) {
      case 'experience':
        return (
          <div className="space-y-4">
            {section.data.map((item, index) => {
              const exp = item as ExperienceData;
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                    <button
                      onClick={() => removeSectionItem(section.id, index)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove experience"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.role || ''}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'role', e.target.value)}
                      placeholder="Job Title"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Job Title"
                    />
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Company Name"
                    />
                    <input
                      type="date"
                      value={exp.startDate || ''}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'startDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Start Date"
                    />
                    <input
                      type="date"
                      value={exp.endDate || ''}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      title="End Date"
                    />
                  </div>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'current', e.target.checked)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Current position</span>
                  </label>
                  
                  <textarea
                    value={exp.description || ''}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'description', e.target.value)}
                    placeholder="Job description and achievements..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              );
            })}
            
            <button
              onClick={() => addSectionItem(section.id)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Experience
            </button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            {section.data.map((item, index) => {
              const skill = item as SkillData;
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">Skill #{index + 1}</h4>
                    <button
                      onClick={() => removeSectionItem(section.id, index)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove skill"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={skill.name || ''}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'name', e.target.value)}
                      placeholder="Skill name"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Skill name"
                    />
                    <select
                      value={skill.level || 'Intermediate'}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'level', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Skill level"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <select
                      value={skill.category || 'Technical'}
                      onChange={(e) => handleSectionDataChange(section.id, index, 'category', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Skill category"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Design">Design</option>
                      <option value="Management">Management</option>
                      <option value="Language">Language</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              );
            })}
            
            <button
              onClick={() => addSectionItem(section.id)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Skill
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Section editor for {section.type} coming soon...</p>
            <button
              onClick={() => addSectionItem(section.id)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add {section.title}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section Navigation */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection('personal')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'personal'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Personal Info
          </button>
          
          {portfolioData.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.title} ({section.data.length})
            </button>
          ))}
          
          <button
            onClick={() => setActiveSection('sections')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'sections'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Reorder Sections
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'personal' ? (
          renderPersonalInfo()
        ) : activeSection === 'sections' ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Order</h3>
            <p className="text-gray-600 mb-6">Use the up/down buttons to reorder sections in your portfolio.</p>
            
            {portfolioData.sections.map((section, index) => (
              <div key={section.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    <p className="text-sm text-gray-500">{section.data.length} items</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveSectionUp(section.id)}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveSectionDown(section.id)}
                      disabled={index === portfolioData.sections.length - 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Individual section editor
          (() => {
            const currentSection = portfolioData.sections.find(s => s.id === activeSection);
            return currentSection ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{currentSection.title}</h3>
                </div>
                {renderSectionEditor(currentSection)}
              </div>
            ) : null;
          })()
        )}
      </div>
    </div>
  );
}
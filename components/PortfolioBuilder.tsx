'use client';

import React, { useState } from 'react';

interface SectionData {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  order: number;
  visible: boolean;
  data: Record<string, unknown>[];
}

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface SectionData {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  order: number;
  visible: boolean;
  data: Record<string, any>[];
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

  const handleSectionDataChange = (sectionId: string, index: number, field: string, value: string) => {
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

    let newItem: Record<string, any> = {};
    
    switch (section.type) {
      case 'experience':
        newItem = { role: '', company: '', startDate: '', endDate: '', current: false, description: '' };
        break;
      case 'education':
        newItem = { degree: '', institution: '', startDate: '', endDate: '', gpa: '', description: '' };
        break;
      case 'skills':
        newItem = { name: '', level: 'Intermediate', category: 'Technical' };
        break;
      case 'projects':
        newItem = { name: '', description: '', technologies: '', github: '', demo: '', startDate: '', endDate: '' };
        break;
      case 'certifications':
        newItem = { name: '', issuer: '', date: '', expiry: '', credentialId: '' };
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

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(portfolioData.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const reorderedSections = items.map((section, index) => ({
      ...section,
      order: index + 1
    }));

    onSectionReorder(reorderedSections);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={portfolioData.personalInfo.name}
            onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={portfolioData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={portfolioData.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={portfolioData.personalInfo.location}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="New York, NY"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
          <input
            type="url"
            value={portfolioData.personalInfo.linkedin}
            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
          <input
            type="url"
            value={portfolioData.personalInfo.github}
            onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://github.com/johndoe"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
        <input
          type="url"
          value={portfolioData.personalInfo.website}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://johndoe.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
        <textarea
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
            {section.data.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                  <button
                    onClick={() => removeSectionItem(section.id, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={item.role || ''}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'role', e.target.value)}
                    placeholder="Job Title"
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={item.company || ''}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'company', e.target.value)}
                    placeholder="Company Name"
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={item.startDate || ''}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'startDate', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={item.endDate || ''}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'endDate', e.target.value)}
                    disabled={item.current}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.current || false}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'current', e.target.checked ? 'true' : 'false')}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Current position</span>
                </label>
                
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleSectionDataChange(section.id, index, 'description', e.target.value)}
                  placeholder="Job description and achievements..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            ))}
            
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
            {section.data.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">Skill #{index + 1}</h4>
                  <button
                    onClick={() => removeSectionItem(section.id, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'name', e.target.value)}
                    placeholder="Skill name"
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={item.level || 'Intermediate'}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'level', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <select
                    value={item.category || 'Technical'}
                    onChange={(e) => handleSectionDataChange(section.id, index, 'category', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Language">Language</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addSectionItem(section.id)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Skill
            </button>
          </div>
        );

      // Similar implementations for education, projects, certifications...
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Section editor for {section.type} coming soon...
            <button
              onClick={() => addSectionItem(section.id)}
              className="block w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
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
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'personal' ? (
          renderPersonalInfo()
        ) : (
          <div>
            {/* Section Reordering */}
            {activeSection === 'sections' ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {portfolioData.sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900">{section.title}</h3>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">{section.data.length} items</span>
                                  <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                      <path d="M10 4a2 2 0 100-4 2 2 0 000 4z"/>
                                      <path d="M10 20a2 2 0 100-4 2 2 0 000 4z"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              // Individual section editor
              (() => {
                const currentSection = portfolioData.sections.find(s => s.id === activeSection);
                return currentSection ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">{currentSection.title}</h3>
                      <button
                        onClick={() => setActiveSection('sections')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Reorder Sections
                      </button>
                    </div>
                    {renderSectionEditor(currentSection)}
                  </div>
                ) : null;
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
}
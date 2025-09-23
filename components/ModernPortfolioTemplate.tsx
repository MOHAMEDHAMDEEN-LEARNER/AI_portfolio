'use client';

import React from 'react';
import Image from 'next/image';

interface PortfolioData {
  name: string;
  email: string;
  phone: string;
  linkedin_url?: string;
  github_url?: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    role: string;
    company: string;
    dates: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    dates: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

interface ModernPortfolioTemplateProps {
  data: PortfolioData;
  isPreview?: boolean;
}

export default function ModernPortfolioTemplate({ data, isPreview = false }: ModernPortfolioTemplateProps) {
  const containerClass = isPreview 
    ? "w-full min-h-full" 
    : "min-h-screen";

  // Default placeholder images for companies/projects
  const defaultImages = [
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=200&fit=crop&crop=center", // Office/workspace
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&crop=center", // Tech/coding
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop&crop=center", // Workspace/laptop
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop&crop=center", // Business/laptop
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop&crop=center", // Team/collaboration
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&crop=center"  // Office building
  ];

  // Fallback gradients if images fail
  const fallbackGradients = [
    "from-blue-100 to-blue-200",
    "from-purple-100 to-purple-200", 
    "from-green-100 to-green-200",
    "from-orange-100 to-orange-200",
    "from-pink-100 to-pink-200",
    "from-indigo-100 to-indigo-200"
  ];

  const getImageForIndex = (index: number) => {
    return defaultImages[index % defaultImages.length];
  };

  const getFallbackGradient = (index: number) => {
    return fallbackGradients[index % fallbackGradients.length];
  };

  return (
    <div className={`${containerClass} bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-bold text-slate-900">
              {data.name.split(' ')[0]}
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <button onClick={() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'})} className="text-slate-600 hover:text-slate-900 transition-colors">About</button>
              <button onClick={() => document.getElementById('experience')?.scrollIntoView({behavior: 'smooth'})} className="text-slate-600 hover:text-slate-900 transition-colors">Experience</button>
              <button onClick={() => document.getElementById('projects')?.scrollIntoView({behavior: 'smooth'})} className="text-slate-600 hover:text-slate-900 transition-colors">Projects</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})} className="text-slate-600 hover:text-slate-900 transition-colors">Contact</button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section id="about" className="mb-16">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Hi I'm Hamdeen
                <span className="block text-blue-600">Data Scientist</span>
                <span className="block text-slate-600 text-2xl lg:text-3xl font-normal mt-2">
                  for Business Success
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                {data.summary}
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-blue-600">✉</span>
                  <span className="text-sm">{data.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-blue-600">📞</span>
                  <span className="text-sm">{data.phone}</span>
                </div>
                {data.linkedin_url && (
                  <a href={data.linkedin_url} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors" title="LinkedIn Profile">
                    <span>💼</span>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {data.github_url && (
                  <a href={data.github_url} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors" title="GitHub Profile">
                    <span>⚡</span>
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
              </div>

              {/* CTA Button */}
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">
                Let&apos;s Talk
              </button>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Skills & Expertise</h3>
              <div className="space-y-4">
                {data.skills.slice(0, 8).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{skill}</span>
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                ))}
                {data.skills.length > 8 && (
                  <div className="text-slate-500 text-sm">+{data.skills.length - 8} more skills</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">My Work</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Here are some of my design works that showcase my ability, skill and expertise. Click on each project to see more details.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.experiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className={`h-48 relative bg-gradient-to-br ${getFallbackGradient(index)}`}>
                  <Image 
                    src={getImageForIndex(index)}
                    alt={`${exp.company} workspace`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Hide image on error, showing gradient background
                      e.currentTarget.style.display = 'none';
                    }}
                    unoptimized // Add this to bypass some Next.js restrictions during development
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 z-10">
                    <div className="text-slate-800 font-bold text-lg">{exp.company}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 mb-2">{exp.role}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <span>📅</span>
                    <span>{exp.dates}</span>
                  </div>
                  <ul className="text-slate-600 text-sm space-y-1">
                    {exp.responsibilities.slice(0, 2).map((resp, idx) => (
                      <li key={idx} className="list-disc list-inside">{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Featured Projects</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {data.projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className={`h-48 relative bg-gradient-to-br ${getFallbackGradient(index + 3)}`}>
                  <Image 
                    src={getImageForIndex(index + 3)} // Offset to get different images
                    alt={`${project.name} preview`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Hide image on error, showing gradient background
                      e.currentTarget.style.display = 'none';
                    }}
                    unoptimized // Add this to bypass some Next.js restrictions during development
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 z-10">
                    <span className="text-slate-600 hover:text-slate-800 transition-colors cursor-pointer">🔗</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{project.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Education</h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{edu.degree}</h3>
                    <p className="text-slate-600">{edu.institution}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 mt-2 md:mt-0">
                    <span>📅</span>
                    <span className="text-sm">{edu.dates}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{data.projects.length}+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{data.experiences.length}+</div>
              <div className="text-blue-100">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Personal Story Section */}
        <section id="contact" className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">My Story</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Growing up in a small village without access to the internet or the latest technology, I was really far from the digital world. My parents were normal employees who weren&apos;t even tech-savvy or studying Photoshop in a photo studio.
            </p>
            <p className="text-slate-600 leading-relaxed">
              My first project was a simple business card design which taught me valuable skills in branding and marketing...
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
            {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-slate-900">{data.name}</div>
              <div className="text-slate-600">© 2025. All rights reserved.</div>
            </div>
            <div className="flex space-x-6">
              {data.linkedin_url && (
                <a href={data.linkedin_url} className="text-blue-600 hover:text-blue-700 transition-colors" title="LinkedIn">
                  💼
                </a>
              )}
              {data.github_url && (
                <a href={data.github_url} className="text-slate-600 hover:text-slate-900 transition-colors" title="GitHub">
                  ⚡
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
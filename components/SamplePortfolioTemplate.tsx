'use client';

import React from 'react';

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

interface SamplePortfolioTemplateProps {
  data: PortfolioData;
  isPreview?: boolean;
}

export default function SamplePortfolioTemplate({ data, isPreview = false }: SamplePortfolioTemplateProps) {
  const containerClass = isPreview 
    ? "w-full min-h-full" 
    : "min-h-screen";

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // For preview mode, find the scrollable container
      if (isPreview) {
        const scrollContainer = element.closest('.overflow-auto');
        if (scrollContainer) {
          const elementTop = element.offsetTop;
          scrollContainer.scrollTo({
            top: elementTop - 20, // Add some offset
            behavior: 'smooth'
          });
        }
      } else {
        // For full screen mode, use regular scroll
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className={`${containerClass} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white`}>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-bold text-green-400">
              {data.name.split(' ')[0]}
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <button onClick={() => handleNavClick('home')} className="text-gray-300 hover:text-white transition-colors">Home</button>
              <button onClick={() => handleNavClick('about')} className="text-gray-300 hover:text-white transition-colors">About</button>
              <button onClick={() => handleNavClick('skills')} className="text-gray-300 hover:text-white transition-colors">Skills</button>
              <button onClick={() => handleNavClick('projects')} className="text-gray-300 hover:text-white transition-colors">Projects</button>
              <button onClick={() => handleNavClick('experience')} className="text-gray-300 hover:text-white transition-colors">Experience</button>
              <button onClick={() => handleNavClick('contact')} className="text-gray-300 hover:text-white transition-colors">Contact</button>
            </div>

            {/* Mobile Navigation Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 mt-4 py-4">
              <div className="flex flex-col space-y-3 text-sm font-medium">
                <button onClick={() => { handleNavClick('home'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">Home</button>
                <button onClick={() => { handleNavClick('about'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">About</button>
                <button onClick={() => { handleNavClick('skills'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">Skills</button>
                <button onClick={() => { handleNavClick('projects'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">Projects</button>
                <button onClick={() => { handleNavClick('experience'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">Experience</button>
                <button onClick={() => { handleNavClick('contact'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">Contact</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section id="home" className="mb-8 sm:mb-12 lg:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-green-400">Hi I&apos;m {data.name.split(' ')[0]},</span>
                <br />
                <span className="text-white">a dedicated developer</span>
                <br />
                <span className="text-white">with expertise in AI & Data Science</span>
              </h1>
              
              {/* Bio Section */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                  {data.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Biography</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {data.summary}
                  </p>
                </div>
              </div>

              {/* What I Do */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-2xl">💻</span>
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">Full Stack Development</h4>
                  <p className="text-gray-400 text-sm">Building end-to-end web applications with modern technologies</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">AI & Machine Learning</h4>
                  <p className="text-gray-400 text-sm">Creating intelligent solutions with cutting-edge AI technologies</p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-6">Let&apos;s connect</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">📧</span>
                  <span className="text-gray-300">{data.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">📱</span>
                  <span className="text-gray-300">{data.phone}</span>
                </div>
                {data.linkedin_url && (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">💼</span>
                    <a href={data.linkedin_url} className="text-blue-400 hover:text-blue-300 transition-colors">LinkedIn</a>
                  </div>
                )}
                {data.github_url && (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">⚡</span>
                    <a href={data.github_url} className="text-gray-300 hover:text-white transition-colors">GitHub</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-gray-800/20 py-8 sm:py-12 lg:py-16 px-3 sm:px-6 mb-8 sm:mb-16 rounded-3xl border border-gray-700/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">About Me</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
              {data.summary}
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-8 sm:mb-16 px-3 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8">Skills & Technologies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50 hover:border-green-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm sm:text-base">{skill}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-8 sm:mb-16 px-3 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {data.projects.map((project, index) => (
              <div key={index} className="bg-gray-800/30 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 hover:border-green-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{project.name}</h3>
                  <span className="text-green-400 hover:text-green-300 transition-colors cursor-pointer text-lg sm:text-xl">🔗</span>
                </div>
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="bg-green-600/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-green-600/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-8 sm:mb-16 px-3 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8">Experience</h2>
          <div className="space-y-4 sm:space-y-6">
            {data.experiences.map((exp, index) => (
              <div key={index} className="bg-gray-800/30 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-green-400 font-medium text-sm sm:text-base">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mt-2 sm:mt-0 text-sm sm:text-base">
                    <span>📅</span>
                    <span>{exp.dates}</span>
                  </div>
                </div>
                <ul className="text-gray-300 space-y-1 sm:space-y-2 text-sm sm:text-base">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Education</h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">{edu.degree}</h3>
                    <p className="text-green-400">{edu.institution}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mt-2 md:mt-0">
                    <span>📅</span>
                    <span className="text-sm">{edu.dates}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gray-800/30 rounded-2xl p-12 border border-gray-700/50">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Let&apos;s Work Together</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              I&apos;m always open to discussing new opportunities and interesting projects. Let&apos;s connect!
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg">
              Get In Touch
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-gray-700/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-green-400">{data.name}</div>
              <div className="text-gray-400">© 2025. All rights reserved.</div>
            </div>
            <div className="flex space-x-6">
              {data.linkedin_url && (
                <a href={data.linkedin_url} className="text-blue-400 hover:text-blue-300 transition-colors" title="LinkedIn">
                  💼
                </a>
              )}
              {data.github_url && (
                <a href={data.github_url} className="text-gray-400 hover:text-white transition-colors" title="GitHub">
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
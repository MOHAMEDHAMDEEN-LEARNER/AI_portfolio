import { type PortfolioData } from './portfolio-service';

export interface PortfolioFile {
  path: string;
  content: string;
}

export class PortfolioGenerator {
  /**
   * Generate complete portfolio files for deployment
   */
  static generatePortfolioFiles(portfolioData: PortfolioData, template: string = 'modern-professional'): PortfolioFile[] {
    const files: PortfolioFile[] = [];

    // Generate HTML files
    files.push(this.generateIndexHTML(portfolioData, template));
    files.push(this.generateAboutHTML(portfolioData, template));
    files.push(this.generateExperienceHTML(portfolioData, template));
    files.push(this.generateProjectsHTML(portfolioData, template));
    files.push(this.generateContactHTML(portfolioData, template));

    // Generate CSS files
    files.push(this.generateMainCSS(template));
    files.push(this.generateResponsiveCSS());

    // Generate JavaScript files
    files.push(this.generateMainJS());

    // Generate configuration files
    files.push(this.generatePackageJSON(portfolioData));
    files.push(this.generateReadmeFile(portfolioData));
    files.push(this.generateGitIgnore());

    return files;
  }

  private static generateIndexHTML(portfolioData: PortfolioData, template: string): PortfolioFile {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.name} - Portfolio</title>
    <meta name="description" content="${portfolioData.summary}">
    <style>
        /* Tailwind CSS Reset and Base Styles */
        *, ::before, ::after {
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            border-color: #e5e7eb;
        }
        
        * {
            --tw-border-spacing-x: 0;
            --tw-border-spacing-y: 0;
            --tw-translate-x: 0;
            --tw-translate-y: 0;
            --tw-rotate: 0;
            --tw-skew-x: 0;
            --tw-skew-y: 0;
            --tw-scale-x: 1;
            --tw-scale-y: 1;
            --tw-scroll-snap-strictness: proximity;
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-color: rgb(59 130 246 / 0.5);
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-ring-shadow: 0 0 #0000;
            --tw-shadow: 0 0 #0000;
            --tw-shadow-colored: 0 0 #0000;
        }
        
        body {
            margin: 0;
            line-height: inherit;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        
        /* Custom Styles Matching Modern Portfolio Template */
        .container { max-width: 1152px; margin: 0 auto; padding: 0 1.5rem; }
        .bg-gradient-main { background: linear-gradient(to bottom right, #f8fafc, #e2e8f0); }
        .bg-gradient-stats { background: linear-gradient(to right, #2563eb, #7c3aed); }
        .text-slate-50 { color: #f8fafc; }
        .text-slate-100 { color: #f1f5f9; }
        .text-slate-500 { color: #64748b; }
        .text-slate-600 { color: #475569; }
        .text-slate-700 { color: #334155; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-900 { color: #0f172a; }
        .text-blue-600 { color: #2563eb; }
        .text-blue-700 { color: #1d4ed8; }
        .text-blue-100 { color: #dbeafe; }
        .bg-white { background-color: #ffffff; }
        .bg-slate-50 { background-color: #f8fafc; }
        .bg-slate-100 { background-color: #f1f5f9; }
        .bg-blue-600 { background-color: #2563eb; }
        .bg-blue-700 { background-color: #1d4ed8; }
        .border-slate-200 { border-color: #e2e8f0; }
        .border-slate-100 { border-color: #f1f5f9; }
        
        /* Layout */
        .min-h-screen { min-height: 100vh; }
        .grid { display: grid; }
        .lg-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .lg-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .md-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .md-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .lg-col-span-2 { grid-column: span 2 / span 2; }
        .gap-12 { gap: 3rem; }
        .gap-8 { gap: 2rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-1 { gap: 0.25rem; }
        
        /* Flexbox */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-wrap { flex-wrap: wrap; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .space-x-8 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-right: calc(2rem * var(--tw-space-x-reverse)); margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse))); }
        .space-x-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-right: calc(1.5rem * var(--tw-space-x-reverse)); margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse))); }
        .space-y-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1rem * var(--tw-space-y-reverse)); }
        .space-y-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1.5rem * var(--tw-space-y-reverse)); }
        .space-y-1 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.25rem * var(--tw-space-y-reverse)); }
        
        /* Typography */
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .text-6xl { font-size: 3.75rem; line-height: 1; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .font-normal { font-weight: 400; }
        .leading-tight { line-height: 1.25; }
        .leading-relaxed { line-height: 1.625; }
        .text-center { text-align: center; }
        
        /* Spacing */
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
        .p-12 { padding: 3rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-12 { margin-bottom: 3rem; }
        .mb-16 { margin-bottom: 4rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        
        /* Borders and Shadows */
        .border { border-width: 1px; }
        .border-b { border-bottom-width: 1px; }
        .border-t { border-top-width: 1px; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
        
        /* Sizing */
        .w-2 { width: 0.5rem; }
        .h-2 { height: 0.5rem; }
        .h-48 { height: 12rem; }
        .max-w-2xl { max-width: 42rem; }
        .max-w-4xl { max-width: 56rem; }
        .max-w-6xl { max-width: 72rem; }
        
        /* Positioning */
        .relative { position: relative; }
        .absolute { position: absolute; }
        .bottom-4 { bottom: 1rem; }
        .left-4 { left: 1rem; }
        .top-4 { top: 1rem; }
        .right-4 { right: 1rem; }
        .z-10 { z-index: 10; }
        
        /* Overflow */
        .overflow-hidden { overflow: hidden; }
        
        /* Transitions */
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-shadow { transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        
        /* Pseudo-elements */
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        
        /* List styles */
        .list-disc { list-style-type: disc; }
        .list-inside { list-style-position: inside; }
        
        /* Hover states */
        .hover\\:text-slate-900:hover { color: #0f172a; }
        .hover\\:text-blue-700:hover { color: #1d4ed8; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .hover\\:text-slate-800:hover { color: #1e293b; }
        
        /* Mobile responsiveness */
        @media (min-width: 768px) {
            .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .md\\:flex { display: flex; }
            .md\\:flex-row { flex-direction: row; }
            .md\\:items-center { align-items: center; }
            .md\\:justify-between { justify-content: space-between; }
            .md\\:mt-0 { margin-top: 0; }
            .md\\:mb-0 { margin-bottom: 0; }
        }
        
        @media (min-width: 1024px) {
            .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .lg\\:col-span-2 { grid-column: span 2 / span 2; }
            .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
            .lg\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        }
        
        /* Hidden class for mobile nav */
        .hidden { display: none; }
        @media (min-width: 768px) {
            .md\\:flex { display: flex; }
        }
        
        /* Custom gradients */
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
        .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
        .from-slate-50 { --tw-gradient-from: #f8fafc; --tw-gradient-to: rgb(248 250 252 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
        .to-slate-100 { --tw-gradient-to: #f1f5f9; }
        .from-blue-600 { --tw-gradient-from: #2563eb; --tw-gradient-to: rgb(37 99 235 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
        .to-purple-600 { --tw-gradient-to: #9333ea; }
        
        .bg-white\\/90 { background-color: rgb(255 255 255 / 0.9); }
        
        /* Project image placeholders */
        .project-image-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .project-image-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .project-image-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .project-image-4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .project-image-5 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .project-image-6 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Button reset */
        button { cursor: pointer; border: none; background: none; }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-6 py-4">
            <nav class="flex items-center justify-between">
                <div class="text-xl font-bold text-slate-900">
                    ${portfolioData.name.split(' ')[0]}
                </div>
                <div class="hidden md:flex space-x-8 text-sm font-medium">
                    <button onclick="scrollToSection('about')" class="text-slate-600 hover:text-slate-900 transition-colors">About</button>
                    <button onclick="scrollToSection('experience')" class="text-slate-600 hover:text-slate-900 transition-colors">Experience</button>
                    <button onclick="scrollToSection('projects')" class="text-slate-600 hover:text-slate-900 transition-colors">Projects</button>
                    <button onclick="scrollToSection('contact')" class="text-slate-600 hover:text-slate-900 transition-colors">Contact</button>
                </div>
            </nav>
        </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-12">
        <!-- Hero Section -->
        <section id="about" class="mb-16">
            <div class="grid lg:grid-cols-3 gap-12 items-start">
                <div class="lg:col-span-2">
                    <h1 class="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        Crafting Memorable
                        <span class="block text-blue-600">User Experiences</span>
                        <span class="block text-slate-600 text-2xl lg:text-3xl font-normal mt-2">
                            for Business Success
                        </span>
                    </h1>
                    <p class="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                        ${portfolioData.summary}
                    </p>
                    
                    <!-- Contact Info -->
                    <div class="flex flex-wrap gap-6 mb-8">
                        <div class="flex items-center gap-2 text-slate-600">
                            <span class="text-blue-600">✉</span>
                            <span class="text-sm">${portfolioData.email}</span>
                        </div>
                        ${portfolioData.phone ? `
                        <div class="flex items-center gap-2 text-slate-600">
                            <span class="text-blue-600">📞</span>
                            <span class="text-sm">${portfolioData.phone}</span>
                        </div>
                        ` : ''}
                        ${portfolioData.linkedin_url ? `
                        <a href="${portfolioData.linkedin_url}" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors" title="LinkedIn Profile">
                            <span>💼</span>
                            <span class="text-sm">LinkedIn</span>
                        </a>
                        ` : ''}
                        ${portfolioData.github_url ? `
                        <a href="${portfolioData.github_url}" class="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors" title="GitHub Profile">
                            <span>⚡</span>
                            <span class="text-sm">GitHub</span>
                        </a>
                        ` : ''}
                    </div>

                    <!-- CTA Button -->
                    <button onclick="scrollToSection('contact')" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">
                        Let's Talk
                    </button>
                </div>

                <!-- Skills Card -->
                <div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h3 class="text-xl font-bold text-slate-900 mb-6">Skills & Expertise</h3>
                    <div class="space-y-4">
                        ${portfolioData.skills.slice(0, 8).map(skill => `
                        <div class="flex items-center justify-between">
                            <span class="text-slate-700 font-medium">${skill}</span>
                            <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        `).join('')}
                        ${portfolioData.skills.length > 8 ? `
                        <div class="text-slate-500 text-sm">+${portfolioData.skills.length - 8} more skills</div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>

        <!-- Experience Section -->
        <section id="experience" class="mb-16">
            <h2 class="text-3xl font-bold text-slate-900 mb-12">My Work</h2>
            <p class="text-slate-600 mb-8 max-w-2xl">
                Here are some of my design works that showcase my ability, skill and expertise. Click on each project to see more details.
            </p>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${portfolioData.experiences && portfolioData.experiences.length > 0 ? 
                    portfolioData.experiences.map((exp, index) => `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                        <div class="h-48 relative project-image-${(index % 6) + 1}">
                            <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 z-10">
                                <div class="text-slate-800 font-bold text-lg">${exp.company}</div>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-slate-900 mb-2">${exp.role}</h3>
                            <div class="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                <span>📅</span>
                                <span>${exp.dates}</span>
                            </div>
                            <ul class="text-slate-600 text-sm space-y-1">
                                ${exp.responsibilities && exp.responsibilities.slice(0, 2).map(resp => `
                                <li class="list-disc list-inside">${resp}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    `).join('')
                : `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                        <div class="h-48 relative project-image-1">
                            <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 z-10">
                                <div class="text-slate-800 font-bold text-lg">Professional Experience</div>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-slate-900 mb-2">Building Expertise</h3>
                            <div class="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                <span>📅</span>
                                <span>Current</span>
                            </div>
                            <ul class="text-slate-600 text-sm space-y-1">
                                <li class="list-disc list-inside">Developing professional skills</li>
                                <li class="list-disc list-inside">Creating meaningful projects</li>
                            </ul>
                        </div>
                    </div>
                `}
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="mb-16">
            <h2 class="text-3xl font-bold text-slate-900 mb-12">Featured Projects</h2>
            
            <div class="grid lg:grid-cols-2 gap-8">
                ${portfolioData.projects && portfolioData.projects.length > 0 ? 
                    portfolioData.projects.map((project, index) => `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                        <div class="h-48 relative project-image-${((index + 3) % 6) + 1}">
                            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 z-10">
                                <span class="text-slate-600 hover:text-slate-800 transition-colors cursor-pointer">🔗</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-slate-900 mb-4">${project.name}</h3>
                            <p class="text-slate-600 mb-6 leading-relaxed">${project.description}</p>
                            <div class="flex flex-wrap gap-2">
                                ${project.technologies && project.technologies.map(tech => `
                                <span class="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                    ${tech}
                                </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    `).join('')
                : `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                        <div class="h-48 relative project-image-3">
                            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 z-10">
                                <span class="text-slate-600">🔗</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-slate-900 mb-4">Sample Project</h3>
                            <p class="text-slate-600 mb-6 leading-relaxed">Innovative solutions and creative implementations.</p>
                            <div class="flex flex-wrap gap-2">
                                ${portfolioData.skills.slice(0, 4).map(skill => `
                                <span class="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                    ${skill}
                                </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `}
            </div>
        </section>

        <!-- Education Section -->
        ${portfolioData.education && portfolioData.education.length > 0 ? `
        <section class="mb-16">
            <h2 class="text-3xl font-bold text-slate-900 mb-8">Education</h2>
            <div class="space-y-6">
                ${portfolioData.education.map(edu => `
                <div class="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 class="font-bold text-slate-900 text-lg">${edu.degree}</h3>
                            <p class="text-slate-600">${edu.institution}</p>
                        </div>
                        <div class="flex items-center gap-2 text-slate-500 mt-2 md:mt-0">
                            <span>📅</span>
                            <span class="text-sm">${edu.dates}</span>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Statistics -->
        <section class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-16">
            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div>
                    <div class="text-4xl font-bold mb-2">${portfolioData.projects ? portfolioData.projects.length : 5}+</div>
                    <div class="text-blue-100">Projects Completed</div>
                </div>
                <div>
                    <div class="text-4xl font-bold mb-2">${portfolioData.experiences ? portfolioData.experiences.length : 3}+</div>
                    <div class="text-blue-100">Years of Experience</div>
                </div>
                <div>
                    <div class="text-4xl font-bold mb-2">100%</div>
                    <div class="text-blue-100">Customer Satisfaction</div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm">
            <div class="max-w-4xl">
                <h2 class="text-3xl font-bold mb-6 text-slate-900">Let's Work Together</h2>
                <p class="text-slate-600 leading-relaxed mb-6">
                    Ready to bring your ideas to life? I'm passionate about creating exceptional digital experiences that make a difference. Let's connect and discuss how we can collaborate on your next project.
                </p>
                <div class="flex flex-wrap gap-6">
                    ${portfolioData.email ? `
                    <a href="mailto:${portfolioData.email}" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                        <span>✉</span>
                        <span>${portfolioData.email}</span>
                    </a>
                    ` : ''}
                    ${portfolioData.phone ? `
                    <a href="tel:${portfolioData.phone}" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                        <span>📞</span>
                        <span>${portfolioData.phone}</span>
                    </a>
                    ` : ''}
                    ${portfolioData.linkedin_url ? `
                    <a href="${portfolioData.linkedin_url}" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                        <span>💼</span>
                        <span>LinkedIn</span>
                    </a>
                    ` : ''}
                    ${portfolioData.github_url ? `
                    <a href="${portfolioData.github_url}" class="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                        <span>⚡</span>
                        <span>GitHub</span>
                    </a>
                    ` : ''}
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-50 border-t border-slate-200 py-12">
        <div class="max-w-6xl mx-auto px-6">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="mb-4 md:mb-0">
                    <div class="text-xl font-bold text-slate-900">${portfolioData.name}</div>
                    <div class="text-slate-600">© ${new Date().getFullYear()}. All rights reserved.</div>
                </div>
                <div class="flex space-x-6">
                    ${portfolioData.linkedin_url ? `
                    <a href="${portfolioData.linkedin_url}" class="text-blue-600 hover:text-blue-700 transition-colors" title="LinkedIn">
                        💼
                    </a>
                    ` : ''}
                    ${portfolioData.github_url ? `
                    <a href="${portfolioData.github_url}" class="text-slate-600 hover:text-slate-900 transition-colors" title="GitHub">
                        ⚡
                    </a>
                    ` : ''}
                </div>
            </div>
        </div>
    </footer>

    <script>
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    </script>
</body>
</html>`;

    return {
      path: 'index.html',
      content: content
    };
  }

  private static generateAboutHTML(portfolioData: PortfolioData, template: string): PortfolioFile {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - ${portfolioData.name}</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${template}">
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="index.html">${portfolioData.name}</a>
            </div>
            <div class="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="about.html" class="nav-link active">About</a>
                <a href="experience.html" class="nav-link">Experience</a>
                <a href="projects.html" class="nav-link">Projects</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <!-- About Section -->
    <section class="about-section">
        <div class="container">
            <div class="about-header">
                <h1>About Me</h1>
                <p class="about-intro">${portfolioData.summary}</p>
            </div>

            <div class="about-content">
                <div class="about-details">
                    <h2>Background</h2>
                    <p>I'm a passionate professional with expertise in various technologies and a drive for creating exceptional digital experiences.</p>
                    
                    ${portfolioData.education && portfolioData.education.length > 0 ? `
                    <h3>Education</h3>
                    <div class="education-list">
                        ${portfolioData.education.map(edu => `
                            <div class="education-item">
                                <h4>${edu.degree}</h4>
                                <p class="institution">${edu.institution}</p>
                                <p class="dates">${edu.dates}</p>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>

                <div class="skills-section">
                    <h2>Skills & Technologies</h2>
                    <div class="skills-grid">
                        ${portfolioData.skills.map(skill => `
                            <div class="skill-item">
                                <span class="skill-name">${skill}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${portfolioData.name}. All rights reserved.</p>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>`;

    return {
      path: 'about.html',
      content: content
    };
  }

  private static generateExperienceHTML(portfolioData: PortfolioData, template: string): PortfolioFile {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Experience - ${portfolioData.name}</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${template}">
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="index.html">${portfolioData.name}</a>
            </div>
            <div class="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="experience.html" class="nav-link active">Experience</a>
                <a href="projects.html" class="nav-link">Projects</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Experience Section -->
    <section class="experience-section">
        <div class="container">
            <div class="section-header">
                <h1>Professional Experience</h1>
                <p>My journey and accomplishments in the professional world</p>
            </div>

            <div class="experience-timeline">
                ${portfolioData.experiences && portfolioData.experiences.length > 0 ? 
                    portfolioData.experiences.map((exp) => `
                        <div class="experience-item">
                            <div class="experience-marker"></div>
                            <div class="experience-content">
                                <h3>${exp.role}</h3>
                                <h4>${exp.company}</h4>
                                <p class="experience-dates">${exp.dates}</p>
                                ${exp.responsibilities && exp.responsibilities.length > 0 ? `
                                    <ul class="responsibilities">
                                        ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        </div>
                    `).join('') 
                : `
                    <div class="experience-item">
                        <div class="experience-marker"></div>
                        <div class="experience-content">
                            <h3>Professional Experience</h3>
                            <p>Building expertise and contributing to meaningful projects.</p>
                        </div>
                    </div>
                `}
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${portfolioData.name}. All rights reserved.</p>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>`;

    return {
      path: 'experience.html',
      content: content
    };
  }

  private static generateProjectsHTML(portfolioData: PortfolioData, template: string): PortfolioFile {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - ${portfolioData.name}</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${template}">
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="index.html">${portfolioData.name}</a>
            </div>
            <div class="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="experience.html" class="nav-link">Experience</a>
                <a href="projects.html" class="nav-link active">Projects</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Projects Section -->
    <section class="projects-section">
        <div class="container">
            <div class="section-header">
                <h1>My Projects</h1>
                <p>A showcase of my work and creative solutions</p>
            </div>

            <div class="projects-grid">
                ${portfolioData.projects && portfolioData.projects.length > 0 ? 
                    portfolioData.projects.map((project) => `
                        <div class="project-card">
                            <div class="project-header">
                                <h3>${project.name}</h3>
                            </div>
                            <div class="project-content">
                                <p>${project.description}</p>
                                ${project.technologies && project.technologies.length > 0 ? `
                                    <div class="project-tech">
                                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('') 
                : `
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Sample Project</h3>
                        </div>
                        <div class="project-content">
                            <p>Innovative solutions and creative implementations.</p>
                            <div class="project-tech">
                                ${portfolioData.skills.slice(0, 4).map(skill => `<span class="tech-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `}
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${portfolioData.name}. All rights reserved.</p>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>`;

    return {
      path: 'projects.html',
      content: content
    };
  }

  private static generateContactHTML(portfolioData: PortfolioData, template: string): PortfolioFile {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - ${portfolioData.name}</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${template}">
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="index.html">${portfolioData.name}</a>
            </div>
            <div class="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="experience.html" class="nav-link">Experience</a>
                <a href="projects.html" class="nav-link">Projects</a>
                <a href="contact.html" class="nav-link active">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Contact Section -->
    <section class="contact-section">
        <div class="container">
            <div class="section-header">
                <h1>Get In Touch</h1>
                <p>Let's discuss your next project or opportunity</p>
            </div>

            <div class="contact-content">
                <div class="contact-info">
                    ${portfolioData.email ? `
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="contact-details">
                                <h3>Email</h3>
                                <a href="mailto:${portfolioData.email}">${portfolioData.email}</a>
                            </div>
                        </div>
                    ` : ''}

                    ${portfolioData.phone ? `
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="contact-details">
                                <h3>Phone</h3>
                                <a href="tel:${portfolioData.phone}">${portfolioData.phone}</a>
                            </div>
                        </div>
                    ` : ''}

                    <div class="social-links">
                        <h3>Connect With Me</h3>
                        <div class="social-icons">
                            ${portfolioData.linkedin_url ? `<a href="${portfolioData.linkedin_url}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${portfolioData.github_url ? `<a href="${portfolioData.github_url}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                </div>

                <div class="contact-form">
                    <form action="#" method="POST">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${portfolioData.name}. All rights reserved.</p>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>`;

    return {
      path: 'contact.html',
      content: content
    };
  }

  private static generateMainCSS(_template: string): PortfolioFile {
    // This would be a comprehensive CSS file - shortened for brevity
    const content = `/* Modern Portfolio CSS */
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  --background-color: #ffffff;
  --text-color: #1e293b;
  --border-color: #e2e8f0;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-color);
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.highlight {
  color: var(--accent-color);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.skill-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.btn-outline {
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: white;
  color: var(--primary-color);
}

.hero-social {
  display: flex;
  gap: 1rem;
}

.hero-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.hero-social a:hover {
  background: white;
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* Sections */
.about-preview,
.quick-contact {
  padding: 4rem 0;
}

.about-preview {
  background: #f8fafc;
}

.quick-contact {
  background: var(--primary-color);
  color: white;
  text-align: center;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.contact-item:hover {
  opacity: 0.8;
}

/* Footer */
.footer {
  background: #1e293b;
  color: white;
  text-align: center;
  padding: 2rem 0;
}

/* Page specific styles */
.about-section,
.experience-section,
.projects-section,
.contact-section {
  padding: 6rem 0 4rem;
  min-height: calc(100vh - 80px);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.skill-item {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.experience-timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.experience-timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--primary-color);
}

.experience-item {
  position: relative;
  margin-bottom: 3rem;
  padding-left: 80px;
}

.experience-marker {
  position: absolute;
  left: 20px;
  top: 0;
  width: 20px;
  height: 20px;
  background: var(--primary-color);
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: var(--shadow);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-header {
  padding: 1.5rem;
  background: var(--primary-color);
  color: white;
}

.project-content {
  padding: 1.5rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tech-tag {
  background: #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  color: var(--secondary-color);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}`;

    return {
      path: 'assets/css/style.css',
      content: content
    };
  }

  private static generateResponsiveCSS(): PortfolioFile {
    const content = `/* Responsive Design */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-info {
    flex-direction: column;
    align-items: center;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .experience-item {
    padding-left: 60px;
  }
  
  .container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-header h1 {
    font-size: 2rem;
  }
  
  .nav-container {
    padding: 1rem;
  }
  
  .hero-container {
    padding: 0 1rem;
  }
}`;

    return {
      path: 'assets/css/responsive.css',
      content: content
    };
  }

  private static generateMainJS(): PortfolioFile {
    const content = `// Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Active navigation link highlighting
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // For demo purposes, just show success message
            alert('Thank you for your message! I\\'ll get back to you soon.');
            this.reset();
        });
    }

    // Scroll event listener
    window.addEventListener('scroll', function() {
        setActiveNavLink();
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Animation on scroll (simple fade-in effect)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .experience-item, .skill-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize
    setActiveNavLink();
});`;

    return {
      path: 'assets/js/main.js',
      content: content
    };
  }

  private static generatePackageJSON(portfolioData: PortfolioData): PortfolioFile {
    const content = JSON.stringify({
      name: `${portfolioData.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
      version: "1.0.0",
      description: `Professional portfolio website for ${portfolioData.name}`,
      main: "index.html",
      scripts: {
        serve: "python -m http.server 8000",
        "serve-node": "npx http-server .",
        build: "echo 'No build process needed for static site'"
      },
      author: portfolioData.name,
      license: "MIT",
      devDependencies: {
        "http-server": "^14.1.1"
      }
    }, null, 2);

    return {
      path: 'package.json',
      content: content
    };
  }

  private static generateReadmeFile(portfolioData: PortfolioData): PortfolioFile {
    const content = `# ${portfolioData.name} - Portfolio Website

A modern, responsive portfolio website showcasing my professional experience, skills, and projects.

## About

${portfolioData.summary}

## Features

- 📱 Fully responsive design
- ⚡ Fast loading and optimized
- 🎨 Modern UI/UX design
- 📧 Contact form integration
- 🔗 Social media links

## Technologies Used

${portfolioData.skills.map(skill => `- ${skill}`).join('\n')}

## Getting Started

### Local Development

1. Clone this repository
2. Open \`index.html\` in your browser
3. Or serve with a local server:

\`\`\`bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server .

# Using PHP
php -S localhost:8000
\`\`\`

### Deployment

This is a static website that can be deployed to:

- **GitHub Pages**: Push to GitHub and enable Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your repository
- **Any web hosting service**: Upload files via FTP

## Project Structure

\`\`\`
├── index.html              # Homepage
├── about.html              # About page
├── experience.html         # Experience page
├── projects.html           # Projects page
├── contact.html            # Contact page
├── assets/
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   └── responsive.css  # Responsive styles
│   └── js/
│       └── main.js         # JavaScript functionality
├── package.json            # Project configuration
└── README.md              # This file
\`\`\`

## Contact

- **Email**: ${portfolioData.email || 'your-email@example.com'}
- **Phone**: ${portfolioData.phone || 'Your Phone Number'}
${portfolioData.linkedin_url ? `- **LinkedIn**: ${portfolioData.linkedin_url}` : ''}
${portfolioData.github_url ? `- **GitHub**: ${portfolioData.github_url}` : ''}

## License

© ${new Date().getFullYear()} ${portfolioData.name}. All rights reserved.
`;

    return {
      path: 'README.md',
      content: content
    };
  }

  private static generateGitIgnore(): PortfolioFile {
    const content = `# Dependencies
node_modules/
npm-debug.log*

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`;

    return {
      path: '.gitignore',
      content: content
    };
  }
}
// Sample portfolio data that matches the database schema structure
export const samplePortfolioData = {
  // Main portfolio data (from portfolios table)
  id: "sample-uuid",
  user_id: "sample-user-uuid",
  name: "Mehedi Hasan",
  email: "mehedihasan@example.com",
  phone: "+1 (555) 123-4567",
  linkedin_url: "https://linkedin.com/in/mehedihasan",
  github_url: "https://github.com/mehedihasan",
  summary: "I blend exquisite design with impeccable functionality for an exceptional user experience, while keeping users captivated.",
  template_id: "modern-minimal",
  status: "completed",
  generated_portfolio_url: "",
  created_at: "2025-01-20T00:00:00Z",
  updated_at: "2025-01-20T00:00:00Z",

  // Skills data (from skills table)
  skills: [
    "Visual Design",
    "User Interface Design", 
    "User Experience",
    "Prototyping",
    "Wireframing",
    "Design Systems",
    "Figma",
    "Adobe Creative Suite",
    "HTML/CSS",
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "PostgreSQL"
  ],

  // Experience data (from experiences table)
  experiences: [
    {
      id: 1,
      portfolio_id: "sample-uuid",
      role: "UX UI Designer, Mentor and Content Creator",
      company: "YouTube @Mehedihasan",
      dates: "Jan 2020 - Present",
      responsibilities: [
        "Create educational content about design principles and best practices",
        "Mentor aspiring designers and developers in their career journey",
        "Design and prototype user interfaces for web and mobile applications",
        "Collaborate with development teams to ensure design implementation"
      ]
    },
    {
      id: 2,
      portfolio_id: "sample-uuid", 
      role: "Senior Product Designer",
      company: "TechCorp Solutions",
      dates: "Mar 2018 - Dec 2019",
      responsibilities: [
        "Led design initiatives for flagship products serving 100k+ users",
        "Conducted user research and usability testing to improve product experience",
        "Collaborated with cross-functional teams to define product requirements",
        "Mentored junior designers and established design system guidelines"
      ]
    },
    {
      id: 3,
      portfolio_id: "sample-uuid",
      role: "UI/UX Designer",
      company: "StartupHub",
      dates: "Jun 2016 - Feb 2018", 
      responsibilities: [
        "Designed user interfaces for early-stage startup products",
        "Created wireframes, prototypes, and high-fidelity mockups",
        "Worked closely with developers to ensure pixel-perfect implementation",
        "Participated in user interviews and feedback sessions"
      ]
    }
  ],

  // Education data (from education table)
  education: [
    {
      id: 1,
      portfolio_id: "sample-uuid",
      degree: "Bachelor of Fine Arts in Graphic Design",
      institution: "Design University",
      dates: "2012 - 2016"
    },
    {
      id: 2,
      portfolio_id: "sample-uuid",
      degree: "UX Design Certification",
      institution: "Google UX Design Professional Certificate",
      dates: "2017"
    }
  ],

  // Projects data (from projects table)
  projects: [
    {
      id: 1,
      portfolio_id: "sample-uuid",
      name: "E-commerce Mobile App Redesign",
      description: "Complete redesign of a mobile shopping app focusing on improved user experience and conversion rates. Implemented new navigation patterns and streamlined checkout process.",
      technologies: ["Figma", "Prototyping", "User Research", "A/B Testing", "React Native"]
    },
    {
      id: 2,
      portfolio_id: "sample-uuid",
      name: "SaaS Dashboard Design System",
      description: "Developed a comprehensive design system for a B2B SaaS platform, including component library, style guide, and documentation to ensure consistency across products.",
      technologies: ["Design Systems", "Figma", "Storybook", "React", "TypeScript"]
    },
    {
      id: 3,
      portfolio_id: "sample-uuid",
      name: "Healthcare Portal Redesign",
      description: "Led the complete redesign of a patient portal for a healthcare provider, focusing on accessibility, ease of use, and mobile-first design principles.",
      technologies: ["Accessibility", "User Research", "Prototyping", "Vue.js", "SCSS"]
    },
    {
      id: 4,
      portfolio_id: "sample-uuid",
      name: "Fintech Mobile Banking App",
      description: "Designed a modern mobile banking application with emphasis on security, trust, and user-friendly financial management features.",
      technologies: ["Mobile Design", "Fintech", "Security UX", "React Native", "API Design"]
    }
  ]
};

// Alternative sample data for different persona
export const samplePortfolioDataDeveloper = {
  id: "sample-dev-uuid",
  user_id: "sample-dev-user-uuid", 
  name: "Sarah Chen",
  email: "sarah.chen@example.com",
  phone: "+1 (555) 987-6543",
  linkedin_url: "https://linkedin.com/in/sarahchen",
  github_url: "https://github.com/sarahchen",
  summary: "Full-stack developer passionate about creating scalable web applications and contributing to open-source projects. Experienced in modern JavaScript frameworks and cloud technologies.",
  template_id: "modern-minimal",
  status: "completed",
  generated_portfolio_url: "",
  created_at: "2025-01-20T00:00:00Z",
  updated_at: "2025-01-20T00:00:00Z",

  skills: [
    "JavaScript",
    "TypeScript", 
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "Python",
    "Django",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST APIs",
    "Git"
  ],

  experiences: [
    {
      id: 1,
      portfolio_id: "sample-dev-uuid",
      role: "Senior Full Stack Developer",
      company: "TechFlow Inc.",
      dates: "Jan 2022 - Present",
      responsibilities: [
        "Lead development of microservices architecture serving 1M+ daily active users",
        "Mentor junior developers and conduct code reviews",
        "Implement CI/CD pipelines and DevOps best practices",
        "Collaborate with product team on feature planning and technical requirements"
      ]
    },
    {
      id: 2,
      portfolio_id: "sample-dev-uuid",
      role: "Full Stack Developer", 
      company: "Digital Solutions LLC",
      dates: "Jun 2019 - Dec 2021",
      responsibilities: [
        "Developed and maintained multiple client web applications",
        "Built RESTful APIs and integrated third-party services",
        "Optimized database queries and improved application performance",
        "Participated in agile development processes and sprint planning"
      ]
    }
  ],

  education: [
    {
      id: 1,
      portfolio_id: "sample-dev-uuid",
      degree: "Bachelor of Science in Computer Science",
      institution: "State University",
      dates: "2015 - 2019"
    }
  ],

  projects: [
    {
      id: 1,
      portfolio_id: "sample-dev-uuid",
      name: "Open Source Task Management Tool",
      description: "Built a collaborative project management tool with real-time updates, file sharing, and team collaboration features. Used by 5k+ teams worldwide.",
      technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "AWS"]
    },
    {
      id: 2, 
      portfolio_id: "sample-dev-uuid",
      name: "E-commerce Analytics Platform",
      description: "Developed a comprehensive analytics platform for e-commerce businesses to track sales, customer behavior, and inventory management.",
      technologies: ["Python", "Django", "React", "D3.js", "Redis", "Docker"]
    }
  ]
};
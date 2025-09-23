'use client';

import React from 'react';

const sampleData = {
  name: "Sarvesh Sawant",
  contact: {
    email: "sarveshsawant44@gmail.com",
    phone: "+91 9356463001"
  },
  summary: "Passionate about AI/ML, full-stack development, and creating innovative solutions.",
  skills: [
    "JavaScript", "Python", "React", "Node.js", "Express.js", "MongoDB",
    "SQL", "HTML/CSS", "Git", "TensorFlow", "PyTorch", "Pandas",
    "NumPy", "scikit-learn", "Bootstrap", "Tailwind CSS", "RESTful APIs",
    "Docker", "AWS", "Machine Learning", "Data Analysis", "Deep Learning"
  ],
  experience: [
    {
      role: "Full Stack Developer",
      company: "Tech Solutions Inc.",
      dates: "Jun 2023 - Present",
      responsibilities: [
        "Developed responsive web applications using React and Node.js",
        "Implemented RESTful APIs and database integration",
        "Collaborated with cross-functional teams to deliver projects on time"
      ]
    },
    {
      role: "AI/ML Intern",
      company: "DataTech Labs",
      dates: "Jan 2023 - May 2023",
      responsibilities: [
        "Built machine learning models for data classification",
        "Performed data analysis and visualization using Python",
        "Contributed to research on deep learning algorithms"
      ]
    }
  ],
  education: [
    {
      degree: "B.Tech in Artificial Intelligence and Data Science",
      institution: "University of Technology",
      dates: "2021 - 2025"
    }
  ],
  projects: [
    {
      name: "AI-Powered Portfolio Generator",
      description: "A web application that uses AI to generate personalized portfolios based on user data and preferences.",
      technologies: ["React", "Node.js", "Python", "TensorFlow", "MongoDB"]
    },
    {
      name: "Smart Data Analytics Dashboard",
      description: "Interactive dashboard for real-time data visualization and analysis with machine learning insights.",
      technologies: ["Python", "Pandas", "Plotly", "Flask", "PostgreSQL"]
    }
  ]
};

export default function SamplePortfolioPreview() {
  return (
    <div className="w-full h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden rounded-lg relative">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-green-400">
            {sampleData.name.split(' ')[0]}
          </div>
          <div className="hidden sm:flex space-x-4 text-xs">
            <span className="text-gray-300">Home</span>
            <span className="text-gray-300">Portfolio</span>
            <span className="text-gray-300">Blog</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-4 h-full">
          {/* Left Column - Main Intro */}
          <div className="col-span-2">
            <h1 className="text-lg font-bold mb-2 leading-tight">
              <span className="text-green-400">Hi I'm {sampleData.name.split(' ')[0]},</span>
              <br />
              <span className="text-white text-sm">a dedicated developer</span>
              <br />
              <span className="text-white text-sm">with expertise in AI & Data Science</span>
            </h1>

            {/* Bio Section */}
            <div className="flex items-start gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-xs">
                {sampleData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-white mb-1">Biography</h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {sampleData.summary}
                </p>
              </div>
            </div>

            {/* What I Do - Mini Version */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800/50 rounded p-2 border border-gray-700/50">
                <div className="w-4 h-4 bg-blue-600 rounded mb-1">
                  <span className="text-white text-xs">💻</span>
                </div>
                <h4 className="text-white font-semibold text-xs">Full Stack</h4>
              </div>
              <div className="bg-gray-800/50 rounded p-2 border border-gray-700/50">
                <div className="w-4 h-4 bg-green-600 rounded mb-1">
                  <span className="text-white text-xs">🤖</span>
                </div>
                <h4 className="text-white font-semibold text-xs">AI & ML</h4>
              </div>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="col-span-1">
            <div className="bg-gray-800/30 rounded p-2 border border-gray-700/50 h-full">
              <h3 className="text-xs font-semibold text-white mb-2">Let's connect</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-green-400 text-xs">📧</span>
                  <span className="text-gray-300 text-xs truncate">sarvesh@email.com</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400 text-xs">📱</span>
                  <span className="text-gray-300 text-xs">+91 93564...</span>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="w-4 h-4 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">ig</span>
                </div>
                <div className="w-4 h-4 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">tw</span>
                </div>
                <div className="w-4 h-4 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">gh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Sample Template" Badge */}
      <div className="absolute top-2 right-2">
        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
          Sample Portfolio
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import Card from '../ui/Card';

export default function KeyFeatures() {
  const features = [
    {
      icon: '🤖',
      title: 'AI Resume Parser',
      description: 'Intelligent extraction of education, skills, and experience from any resume format with 95% accuracy.',
      benefits: ['Auto-extracts key information', 'Supports multiple file formats', 'Smart content organization'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '💼',
      title: 'Live Project Showcase',
      description: 'Automatically sync and display your latest GitHub repositories, live demos, and project screenshots.',
      benefits: ['Real-time GitHub sync', 'Live demo integration', 'Project status tracking'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '🎓',
      title: 'Education & Certificates',
      description: 'Beautiful display of your academic background, online courses, and professional certifications.',
      benefits: ['Academic timeline view', 'Certificate verification', 'Skill badge integration'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '📝',
      title: 'Blog Integration',
      description: 'Showcase your technical writing and thought leadership with integrated blog posts and articles.',
      benefits: ['Medium/Dev.to sync', 'Article preview cards', 'Reading time estimates'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: '🎨',
      title: 'Multiple Templates',
      description: 'Choose from modern, clean, or developer-focused designs that match your personal brand.',
      benefits: ['10+ professional templates', 'Easy customization', 'Mobile-responsive design'],
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: '🔗',
      title: 'Custom Portfolio Link',
      description: 'Get a personalized URL like yourname.portfoliogen.com to share with recruiters and network.',
      benefits: ['Custom domain options', 'SEO optimized URLs', 'Easy social sharing'],
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Perfect viewing experience across all devices - desktop, tablet, and mobile.',
      benefits: ['Mobile-first approach', 'Fast loading speeds', 'Cross-browser compatibility'],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: '⚡',
      title: 'One-Click Deploy',
      description: 'Publish your portfolio instantly with just one click. No technical knowledge required.',
      benefits: ['Instant deployment', 'CDN-powered hosting', '99.9% uptime guarantee'],
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
            Key Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for a
            <span className="text-blue-600"> Professional Portfolio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need to create, 
            customize, and share a portfolio that stands out to employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} hover className="h-full bg-white border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div id="why-choose" className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg scroll-offset">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Portfolio Generator?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our platform compares to traditional portfolio creation methods.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600">AI Portfolio Generator</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-500">Manual Creation</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-500">Template Sites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Setup Time</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      5 minutes
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500">2-3 weeks</td>
                  <td className="py-4 px-6 text-center text-gray-500">1-2 days</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Technical Skills Required</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      None
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500">High</td>
                  <td className="py-4 px-6 text-center text-gray-500">Medium</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Automatic Updates</td>
                  <td className="py-4 px-6 text-center">
                    <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg className="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg className="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Mobile Responsive</td>
                  <td className="py-4 px-6 text-center">
                    <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-yellow-500 text-sm">Depends</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Cost</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Free for Students
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500">$500-2000+</td>
                  <td className="py-4 px-6 text-center text-gray-500">$10-50/month</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
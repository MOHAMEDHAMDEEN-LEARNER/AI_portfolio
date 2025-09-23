import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Resume',
      description: 'AI extracts education, skills, and experience automatically from your CV or resume file.',
      icon: '📄',
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: '02',
      title: 'Connect GitHub/LinkedIn',
      description: 'Auto-imports projects, repositories, blogs, and certificates from your professional profiles.',
      icon: '🔗',
      color: 'from-green-500 to-green-600'
    },
    {
      step: '03',
      title: 'Choose a Template',
      description: 'Select from clean, modern, or developer-focused layouts that match your style.',
      icon: '🎨',
      color: 'from-purple-500 to-purple-600'
    },
    {
      step: '04',
      title: 'Publish Instantly',
      description: 'Share a custom link with recruiters, friends, or on social media within minutes.',
      icon: '🚀',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            4 Simple Steps to Your
            <span className="text-blue-600"> Perfect Portfolio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered system makes portfolio creation effortless. 
            Just follow these simple steps and watch your professional portfolio come to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 transform translate-x-4">
                  <div className="absolute right-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
              )}
              
              <Card hover className="text-center h-full relative z-10 bg-white border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400 tracking-wider">STEP {step.step}</div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to create your portfolio in minutes?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have already created stunning portfolios with our AI-powered generator.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
              🚀 Start Building Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:text-blue-600 transition-colors duration-200"
              //className="bg-white text-blue-600 border border-gray-300 py-2 px-4 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
              //className="border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-600 hover:bg-transparent px-8 py-4"
            >
              👀 View Live Examples
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span>Free for students</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span>Ready in 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
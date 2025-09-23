import React from 'react';

export default function ProblemStatement() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          The Problem Most Students Face
        </h2>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Most students and early professionals struggle to showcase their skills and projects online. 
          Traditional portfolios take time, coding knowledge, and design effort.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Consuming</h3>
            <p className="text-gray-600">Building a portfolio from scratch takes weeks of design and development work</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Requires Coding</h3>
            <p className="text-gray-600">Not everyone knows HTML, CSS, or web development frameworks</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Challenges</h3>
            <p className="text-gray-600">Creating a professional, visually appealing design requires expertise</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our AI-Powered Solution</h3>
          <p className="text-lg text-gray-600">
            Our AI-powered generator removes these barriers by building a recruiter-ready portfolio automatically. 
            No coding, no design skills, no time waste — just upload and deploy!
          </p>
        </div>
      </div>
    </section>
  );
}
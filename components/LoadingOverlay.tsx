'use client';

import React from 'react';

interface LoadingOverlayProps {
  progress: number;
  currentStep: string;
  steps: string[];
}

export default function LoadingOverlay({ progress, currentStep, steps }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = progress >= (stepNumber * 20);
              const isCurrent = currentStep === step;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  {/* Step Circle */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : isCurrent
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </div>
                  
                  {/* Step Text */}
                  <div className={`flex-1 transition-colors duration-300 ${
                    isCompleted
                      ? 'text-gray-900 font-medium'
                      : isCurrent
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-500'
                  }`}>
                    {step}
                  </div>
                  
                  {/* Loading Spinner for Current Step */}
                  {isCurrent && !isCompleted && (
                    <div className="flex-shrink-0">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Large Progress Percentage */}
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-400 mb-2 tracking-wider">
            {progress}%
          </div>
          <div className="text-gray-600 font-medium">
            {progress === 100 ? 'Deployment Complete!' : 'Creating your portfolio...'}
          </div>
          {progress < 100 && (
            <div className="text-sm text-gray-500 mt-1">
              {currentStep}
            </div>
          )}
        </div>

        {/* Animated Dots */}
        {progress < 100 && (
          <div className="flex justify-center mt-6 space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}

        {/* Success Icon for 100% */}
        {progress === 100 && (
          <div className="flex justify-center mt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
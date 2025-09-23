'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../lib/auth-guard';
import Button from '../../components/ui/Button';
import { useToast } from '../../lib/toast-context';

export default function GitHubDeployPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [repositoryName, setRepositoryName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Get portfolio data from URL params
  const portfolioData = {
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    summary: searchParams.get('summary') || '',
    skills: searchParams.get('skills') || '',
    phone: searchParams.get('phone') || '',
    linkedin_url: searchParams.get('linkedin_url') || '',
    github_url: searchParams.get('github_url') || '',
  };

  const suggestedRepoName = `${portfolioData.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`;

  const handleDownloadFiles = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/download-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: portfolioData.name,
          email: portfolioData.email,
          summary: portfolioData.summary,
          skills: portfolioData.skills?.split(',').map((s: string) => s.trim()) || [],
          linkedin_url: portfolioData.linkedin_url,
          github_url: portfolioData.github_url,
          phone: portfolioData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate portfolio files');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${portfolioData.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('Portfolio files downloaded! Follow the steps below to deploy.', 'success');
      setCurrentStep(2);
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download portfolio files', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const steps = [
    {
      title: 'Download Your Portfolio Files',
      description: 'First, download your portfolio HTML file that we\'ll upload to GitHub.',
      action: 'download'
    },
    {
      title: 'Create GitHub Repository', 
      description: 'Create a new repository on GitHub for your portfolio.',
      action: 'create-repo'
    },
    {
      title: 'Upload Files to GitHub',
      description: 'Upload your portfolio file to the repository.',
      action: 'upload-files'
    },
    {
      title: 'Enable GitHub Pages',
      description: 'Configure GitHub Pages to serve your portfolio.',
      action: 'enable-pages'
    },
    {
      title: 'Access Your Live Portfolio',
      description: 'Your portfolio will be live on GitHub Pages!',
      action: 'complete'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Deploy
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Deploy to GitHub Pages</h1>
              <p className="text-gray-600">Follow these steps to deploy your portfolio</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > index + 1 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : currentStep === index + 1
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {currentStep > index + 1 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Step 1: Download Files */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-blue-900 mb-2">What you&apos;ll get:</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Complete HTML portfolio file with embedded styles</li>
                        <li>• Self-contained website ready for GitHub Pages</li>
                        <li>• Professional design matching your template</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleDownloadFiles}
                    disabled={isDownloading}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating Files...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Portfolio Files
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Create Repository */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Repository Name Suggestion:</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <code className="text-blue-600 font-mono">{suggestedRepoName}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(suggestedRepoName);
                        showToast('Repository name copied to clipboard!', 'success');
                      }}
                      className="ml-3 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Follow these steps:</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">GitHub.com/new</a></li>
                    <li>Enter repository name: <code className="bg-gray-100 px-2 py-1 rounded">{suggestedRepoName}</code></li>
                    <li>Make sure the repository is <strong>Public</strong></li>
                    <li>Check &quot;Add a README file&quot;</li>
                    <li>Click &quot;Create repository&quot;</li>
                  </ol>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Repository Created
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Files */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Upload your portfolio file:</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>In your new repository, click &quot;uploading an existing file&quot;</li>
                    <li>Drag and drop your downloaded portfolio HTML file</li>
                    <li>Rename the file to <code className="bg-gray-100 px-2 py-1 rounded">index.html</code> (important!)</li>
                    <li>Scroll down and click &quot;Commit changes&quot;</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-1">Important!</h4>
                      <p className="text-sm text-yellow-800">The file MUST be named <code>index.html</code> for GitHub Pages to work properly.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(4)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Files Uploaded
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Enable Pages */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Enable GitHub Pages:</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>In your repository, click the &quot;Settings&quot; tab</li>
                    <li>Scroll down to &quot;Pages&quot; in the left sidebar</li>
                    <li>Under &quot;Source&quot;, select &quot;Deploy from a branch&quot;</li>
                    <li>Choose &quot;main&quot; branch and &quot;/ (root)&quot;</li>
                    <li>Click &quot;Save&quot;</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Note</h4>
                      <p className="text-sm text-blue-800">It may take a few minutes for your site to become available.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(3)}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(5)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Pages Enabled
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Your Portfolio is Live!</h3>
                  <p className="text-gray-600 mb-6">Your portfolio should be available at:</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <code className="text-blue-600 font-mono text-lg">
                      https://YOUR-USERNAME.github.io/{suggestedRepoName}
                    </code>
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                    Replace &quot;YOUR-USERNAME&quot; with your actual GitHub username
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/generate')}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Create Another Portfolio
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../lib/auth-guard';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import Button from '../../components/ui/Button';
import { DeploymentService, type DeploymentConfig, type DeploymentProvider } from '../../lib/deployment-service';

export default function DeployPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { } = useAuth();
  const { showToast } = useToast();
  
  // Get portfolio data from URL params
  const portfolioData = {
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    template: searchParams.get('template') || 'aesthetic-portfolio',
    phone: searchParams.get('phone') || '',
    linkedin_url: searchParams.get('linkedin_url') || '',
    github_url: searchParams.get('github_url') || '',
    summary: searchParams.get('summary') || '',
    skills: searchParams.get('skills') || '',
  };

  // Deployment state
  const [selectedProvider, setSelectedProvider] = useState<DeploymentProvider>('vercel');
  const [domainName, setDomainName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Deployment configuration
  const [config, setConfig] = useState<DeploymentConfig>({
    provider: 'vercel',
    projectName: '',
    domain: '',
    customDomain: '',
    envVars: {},
    buildCommand: 'npm run build',
    outputDirectory: 'out',
    nodeVersion: '18.x'
  });

  // Generate suggested domain name from portfolio data
  useEffect(() => {
    if (portfolioData.name && !domainName) {
      const suggested = portfolioData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 30);
      setDomainName(suggested + '-portfolio');
      setConfig((prev: DeploymentConfig) => ({ ...prev, projectName: suggested + '-portfolio' }));
    }
  }, [portfolioData.name, domainName]);

  // Handle deployment
  const handleDeploy = async () => {
    // For download option, domain name is not required
    if (selectedProvider !== 'download' && !domainName.trim()) {
      showToast('Please enter a domain name', 'error');
      return;
    }

    const finalConfig: DeploymentConfig = {
      ...config,
      provider: selectedProvider,
      projectName: domainName || portfolioData.name.toLowerCase().replace(/\s+/g, '-'),
      domain: useCustomDomain ? customDomain : `${domainName}.${getProviderDomain(selectedProvider)}`,
      customDomain: useCustomDomain ? customDomain : '',
      portfolioData
    };

    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      const result = await DeploymentService.deploy(finalConfig, (progress: number, step: string) => {
        setDeploymentProgress(progress);
        setCurrentStep(step);
      });

      if (result.success) {
        if (selectedProvider === 'download') {
          // Trigger download
          await handleDownload();
          showToast('Portfolio HTML file generated! Download starting...', 'success');
        } else if (selectedProvider === 'github-pages') {
          // Redirect to GitHub Pages guided setup
          const params = new URLSearchParams({
            name: portfolioData.name,
            email: portfolioData.email,
            summary: portfolioData.summary,
            skills: portfolioData.skills || '',
            phone: portfolioData.phone,
            linkedin_url: portfolioData.linkedin_url,
            github_url: portfolioData.github_url,
          });
          router.push(`/github-deploy?${params.toString()}`);
          return;
        } else {
          setDeploymentUrl(result.url || '');
          showToast('Portfolio deployed successfully! 🎉', 'success');
        }
      } else {
        console.error('Deployment failed:', result.error);
        showToast(`Deployment failed: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showToast(`Deployment failed: ${errorMessage}`, 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDownload = async () => {
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
        throw new Error('Failed to generate download');
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

    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download portfolio files', 'error');
    }
  };

  const getProviderDomain = (provider: DeploymentProvider): string => {
    switch (provider) {
      case 'vercel': return 'vercel.app';
      case 'netlify': return 'netlify.app';
      case 'github-pages': return 'github.io';
      case 'download': return '';
      default: return 'app.com';
    }
  };

  const getProviderIcon = (provider: DeploymentProvider) => {
    switch (provider) {
      case 'vercel':
        return (
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">▲</span>
          </div>
        );
      case 'netlify':
        return (
          <div className="w-6 h-6 bg-gradient-to-r from-teal-400 to-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
        );
      case 'github-pages':
        return (
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'download':
        return (
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

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
              Back to Portfolio
            </button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Deploy Your Portfolio</h1>
              <p className="text-gray-600">Choose your deployment settings and go live</p>
            </div>
          </div>

          {!isDeploying && !deploymentUrl ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {/* Provider Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Deployment Platform</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(['vercel', 'netlify', 'github-pages', 'download'] as DeploymentProvider[]).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setSelectedProvider(provider)}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        selectedProvider === provider
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {getProviderIcon(provider)}
                        <span className="font-semibold capitalize">
                          {provider === 'github-pages' ? 'GitHub Pages' : provider}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 text-left">
                        {provider === 'vercel' && 'Fast, reliable hosting with automatic deployments'}
                        {provider === 'netlify' && 'Global CDN with continuous deployment'}
                        {provider === 'github-pages' && 'Free hosting with guided setup - we\'ll help you deploy step by step'}
                        {provider === 'download' && 'Download portfolio as ZIP file for manual deployment'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain Configuration - only show for hosting providers */}
              {selectedProvider !== 'download' && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Domain Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="domain-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        id="domain-name"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="my-awesome-portfolio"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {domainName && (
                        <p className="mt-2 text-sm text-gray-600">
                          Your portfolio will be available at: <strong>{domainName}.{getProviderDomain(selectedProvider)}</strong>
                        </p>
                      )}
                    </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="custom-domain"
                      checked={useCustomDomain}
                      onChange={(e) => setUseCustomDomain(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="custom-domain" className="ml-2 text-sm text-gray-700">
                      Use custom domain
                    </label>
                  </div>

                  {useCustomDomain && (
                    <div>
                      <label htmlFor="custom-domain-input" className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Domain
                      </label>
                      <input
                        type="text"
                        id="custom-domain-input"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="www.mydomain.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Note: You&apos;ll need to configure DNS settings with your domain provider
                      </p>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Download Info - only show for download option */}
              {selectedProvider === 'download' && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Download Information</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-blue-900 mb-2">What you&apos;ll get:</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Complete HTML portfolio file with embedded CSS and JavaScript</li>
                          <li>• Self-contained single-file website</li>
                          <li>• Ready to upload to any web hosting service</li>
                          <li>• Can be opened directly in any web browser</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              <div className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Advanced Settings
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                    <div>
                      <label htmlFor="build-command" className="block text-sm font-medium text-gray-700 mb-2">
                        Build Command
                      </label>
                      <input
                        id="build-command"
                        type="text"
                        value={config.buildCommand}
                        onChange={(e) => setConfig((prev: DeploymentConfig) => ({ ...prev, buildCommand: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="output-directory" className="block text-sm font-medium text-gray-700 mb-2">
                        Output Directory
                      </label>
                      <input
                        id="output-directory"
                        type="text"
                        value={config.outputDirectory}
                        onChange={(e) => setConfig((prev: DeploymentConfig) => ({ ...prev, outputDirectory: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Deploy Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleDeploy}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  {selectedProvider === 'download' ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Portfolio
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Deploy Portfolio
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : isDeploying ? (
            /* Deployment Progress */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Deploying Your Portfolio</h2>
              <p className="text-gray-600 mb-6">{currentStep}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  data-width={deploymentProgress}
                  ref={(el) => {
                    if (el) el.style.width = `${deploymentProgress}%`;
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{deploymentProgress}% complete</p>
            </div>
          ) : (
            /* Deployment Success */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {selectedProvider === 'download' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Files Downloaded! 📁</h2>
                  <p className="text-gray-600 mb-6">Your portfolio files have been generated and downloaded</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-900 mb-2">Next steps:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 text-left">
                      <li>• Your portfolio HTML file has been downloaded</li>
                      <li>• Upload the file to your web hosting service</li>
                      <li>• Or deploy to platforms like GitHub Pages, Netlify, or Vercel</li>
                      <li>• For a complete package with CSS/JS, consider using the hosting options above</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Deployed Successfully! 🎉</h2>
                  <p className="text-gray-600 mb-6">Your portfolio is now live and accessible to the world</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Your portfolio URL:</p>
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium break-all"
                    >
                      {deploymentUrl}
                    </a>
                  </div>
                </>
              )}

              <div className="flex gap-4 justify-center">
                {selectedProvider !== 'download' && (
                  <Button
                    onClick={() => window.open(deploymentUrl, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Portfolio
                  </Button>
                )}
                <Button
                  onClick={() => router.push('/generate')}
                  variant="outline"
                >
                  Create Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
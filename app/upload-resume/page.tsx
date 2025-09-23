'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../lib/auth-guard';
import { useAuth } from '../../lib/auth-context';
import Button from '../../components/ui/Button';

export default function UploadResumePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTemplate = searchParams.get('template') || 'aesthetic-portfolio';
  
  const [formData, setFormData] = useState({
    resumeUrl: '',
    fileName: '',
    linkedinUrl: '',
    githubUrl: '',
    additionalInfo: '',
    uploadedFile: null as File | null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Cleanup object URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.resumeUrl && formData.resumeUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.resumeUrl);
      }
    };
  }, [formData.resumeUrl]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    console.log('File selected:', file.name);
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(pdf|doc|docx)$/)) {
      alert('Please upload a PDF, DOC, or DOCX file only.');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clean up previous object URL if exists
      if (formData.resumeUrl && formData.resumeUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.resumeUrl);
      }

      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Store the file data for later use
      setFormData(prev => ({
        ...prev,
        resumeUrl: fileUrl,
        fileName: file.name,
        uploadedFile: file
      }));
      
      console.log('File processed successfully:', file.name);
    } catch (error) {
      console.error('File handling error:', error);
      alert('Failed to process file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    // Send PDF to webhook if one was uploaded
    if (formData.uploadedFile && formData.resumeUrl) {
      try {
        setIsLoading(true);
        
        // Create FormData to send the file
        const webhookFormData = new FormData();
        webhookFormData.append('file', formData.uploadedFile);
        webhookFormData.append('userId', user?.id || '');
        webhookFormData.append('userEmail', user?.email || '');
        webhookFormData.append('template', selectedTemplate);
        webhookFormData.append('linkedinUrl', formData.linkedinUrl);
        webhookFormData.append('githubUrl', formData.githubUrl);
        webhookFormData.append('additionalInfo', formData.additionalInfo);

        // Send to webhook
        const response = await fetch('https://glowing-amusing-stinkbug.ngrok-free.app/webhook/ai-portfolio', {
          method: 'POST',
          body: webhookFormData,
        });

        if (!response.ok) {
          console.error('Webhook failed:', response.statusText);
          alert('Failed to process resume. Continuing without AI analysis.');
        } else {
          console.log('Resume sent to AI processing successfully');
        }
      } catch (error) {
        console.error('Webhook error:', error);
        alert('Failed to process resume. Continuing without AI analysis.');
      } finally {
        setIsLoading(false);
      }
    }

    // Navigate to the generating page with all the data
    const params = new URLSearchParams({
      template: selectedTemplate,
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
      email: user?.email || '',
      resume: formData.resumeUrl,
      linkedin: formData.linkedinUrl,
      github: formData.githubUrl,
      additionalInfo: formData.additionalInfo
    });

    router.push(`/generating?${params.toString()}`);
  };

  const handleSkip = () => {
    // Skip resume upload and go directly to generating page
    const params = new URLSearchParams({
      template: selectedTemplate,
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
      email: user?.email || '',
      linkedin: formData.linkedinUrl,
      github: formData.githubUrl,
      additionalInfo: formData.additionalInfo
    });

    router.push(`/generating?${params.toString()}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Upload Your Resume</h1>
                <p className="text-sm text-gray-600 mt-1">Help us generate a better portfolio by uploading your resume</p>
              </div>
              <button
                onClick={() => router.push('/generate')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Templates
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Template Info */}
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 capitalize">
                    {selectedTemplate.replace('-', ' ')} Template Selected
                  </h2>
                  <p className="text-sm text-gray-600">Ready to generate your portfolio</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Upload Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Resume (Optional)</h3>
                  <p className="text-sm text-gray-600">Upload your resume to automatically extract information for your portfolio</p>
                </div>

                {/* Drag and Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : formData.resumeUrl 
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    disabled={isLoading}
                    aria-label="Upload resume file"
                  />
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-blue-600 font-medium">Uploading your resume...</p>
                    </div>
                  ) : formData.resumeUrl ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-green-600 font-medium">Resume uploaded successfully!</p>
                        {formData.fileName && (
                          <p className="text-sm font-medium text-gray-700 mt-1">📄 {formData.fileName}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">We&apos;ll use this to populate your portfolio</p>
                      </div>
                      <button
                        onClick={() => {
                          // Clean up the object URL to prevent memory leaks
                          if (formData.resumeUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(formData.resumeUrl);
                          }
                          setFormData(prev => ({ ...prev, resumeUrl: '', fileName: '', uploadedFile: null }));
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Upload a different file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Drop your resume here or click to browse</p>
                        <p className="text-sm text-gray-500 mt-1">Supports PDF, DOC, and DOCX files</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      id="linkedin"
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/your-profile"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      id="github"
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/your-username"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="additional-info" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="additional-info"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information you'd like to include in your portfolio..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleContinue}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  Continue to Portfolio Builder
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Skip and Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
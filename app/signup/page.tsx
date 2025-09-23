'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import { AuthService } from '../../lib/auth';
import { useAuthGuard } from '../../lib/auth-guard';

export default function SignupPage() {
  const { requireGuest } = useAuthGuard();
  const { loading } = requireGuest('/'); // Redirect authenticated users to home page
  
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    studentId: '',
    course: '',
    yearOfGraduation: '',
    collegeName: '',
    linkedinProfile: '',
    githubProfile: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    }

    if (!formData.course) {
      newErrors.course = 'Please select your course';
    }

    if (!formData.yearOfGraduation) {
      newErrors.yearOfGraduation = 'Please select your graduation year';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber || undefined,
        studentId: formData.studentId || undefined,
        course: formData.course || undefined,
        yearOfGraduation: formData.yearOfGraduation || undefined,
        collegeName: formData.collegeName || undefined,
        linkedinProfile: formData.linkedinProfile || undefined,
        githubProfile: formData.githubProfile || undefined
      });

      if (result.success) {
        setMessage({ 
          type: result.message.includes('database schema') ? 'error' : 'success', 
          text: result.message
        });
        
        // If database schema is missing, show helpful link
        if (result.message.includes('database schema')) {
          setTimeout(() => {
            setMessage({ 
              type: 'error', 
              text: result.message + ' Visit /database-setup for instructions.'
            });
          }, 100);
        }
        
        // Clear form after successful registration (only if no schema issues)
        if (!result.message.includes('database schema')) {
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            mobileNumber: '',
            studentId: '',
            course: '',
            yearOfGraduation: '',
            collegeName: '',
            linkedinProfile: '',
            githubProfile: '',
            agreeToTerms: false
          });
        }
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const courses = [
    'Computer Science', 'Information Technology', 'Software Engineering',
    'Data Science', 'Artificial Intelligence', 'Cybersecurity',
    'Web Development', 'Mobile App Development', 'Business Administration',
    'Marketing', 'Design', 'Engineering', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <Image
              src="/image.png"
              alt="AI Portfolio Generator Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span className="text-gray-900 font-bold text-2xl">AI Portfolio</span>
          </Link>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join thousands of students building amazing portfolios with AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 1234567890"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                  )}
                </div>

                {/* Student ID */}
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID (Optional)
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your student ID"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Academic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course */}
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.course ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                  {errors.course && (
                    <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                  )}
                </div>

                {/* Year of Graduation */}
                <div>
                  <label htmlFor="yearOfGraduation" className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Graduation *
                  </label>
                  <select
                    id="yearOfGraduation"
                    name="yearOfGraduation"
                    value={formData.yearOfGraduation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.yearOfGraduation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.yearOfGraduation && (
                    <p className="mt-1 text-sm text-red-600">{errors.yearOfGraduation}</p>
                  )}
                </div>

                {/* College Name */}
                <div className="md:col-span-2">
                  <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-2">
                    College/University Name *
                  </label>
                  <input
                    id="collegeName"
                    name="collegeName"
                    type="text"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.collegeName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your college/university name"
                  />
                  {errors.collegeName && (
                    <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Profiles Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Social Profiles (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LinkedIn Profile */}
                <div>
                  <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    id="linkedinProfile"
                    name="linkedinProfile"
                    type="url"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* GitHub Profile */}
                <div>
                  <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    id="githubProfile"
                    name="githubProfile"
                    type="url"
                    value={formData.githubProfile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 ${
                    errors.agreeToTerms ? 'border-red-500' : ''
                  }`}
                />
                <div className="ml-3">
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
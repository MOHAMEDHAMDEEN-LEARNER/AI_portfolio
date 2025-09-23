'use client';

import React from 'react';
import Button from '../ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { AuthUtils } from '../../lib/auth-utils';

export default function Hero() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      // Use default redirect (will go to login page)
      await signOut();
    } catch (error) {
      console.error('SignOut error in Hero:', error);
      // Force logout as fallback
      AuthUtils.forceLogout();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-12">
          <a href="#" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
            <Image
              src="/image.png"
              alt="AI Portfolio Generator Logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
            />
            <span className="text-gray-900 font-bold text-xl">AI Portfolio</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={scrollToTop}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer"
            >
              Home
            </button>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">How It Works?</a>
            <a href="#why-choose" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Why?</a>
          </div>

          <div className="flex items-center space-x-3">
            {loading ? (
              // Loading state
              <div className="flex items-center space-x-3">
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              // Authenticated state
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium hidden md:block">
                  Welcome, {user.user_metadata?.full_name || user.email}!
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              // Unauthenticated state
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-between min-h-screen px-6 lg:px-12 pt-20">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your Professional
            <span className="block text-blue-600">
              Portfolio
            </span>
            <span className="block text-2xl lg:text-3xl font-normal text-gray-600 mt-2">
              Auto-Generated by AI
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
            Don&apos;t waste hours designing a website. Upload your resume, connect GitHub & LinkedIn, 
            and let AI create a stunning, dynamic portfolio in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {user ? (
              // Authenticated user - show direct access to dashboard/generate
              <>
                <Link href="/generate">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🚀 Create Portfolio
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    📄 View My Portfolios
                  </Button>
                </Link>
              </>
            ) : (
              // Unauthenticated user - encourage signup
              <>
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🚀 Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-8 py-4 text-lg transition-all duration-200"
                  >
                    👀 Already have an account?
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span>No coding required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span>Free for students</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration - Portfolio Example */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative w-96 h-96 lg:w-[750px] lg:h-[500px]">
            {/* Main Portfolio Preview */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <Image
                src="/image copy.png"
                alt="Example Portfolio Preview"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            
            {/* Floating Elements */}
            
            
            <div className="absolute top-8 -right-6 w-12 h-12 bg-blue-100 rounded-full floating delay-1000 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">AI</span>
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-green-100 rounded-lg floating delay-2000 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            
            <div className="absolute bottom-8 -right-4 w-10 h-10 bg-orange-100 rounded-full floating delay-500 flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xs">✓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
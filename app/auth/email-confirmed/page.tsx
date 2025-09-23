'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';

export default function EmailConfirmedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login?message=Please sign in to continue');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
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
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Email Confirmed!
            </h2>
            <p className="mt-2 text-gray-600">
              Welcome to AI Portfolio, {user.user_metadata?.full_name || user.email}! 
              Your email has been successfully confirmed.
            </p>

            <div className="mt-6 space-y-4">
              <div className="text-sm text-gray-500">
                <p>You can now:</p>
                <ul className="mt-2 text-left list-disc list-inside space-y-1">
                  <li>Create your AI-generated portfolio</li>
                  <li>Upload your resume and connect social profiles</li>
                  <li>Customize your portfolio design</li>
                  <li>Share your professional portfolio with the world</li>
                </ul>
              </div>              <div className="flex flex-col space-y-3">
                <Link href="/">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    🏠 Go to Home
                  </Button>
                </Link>
                <Link href="/generate">
                  <Button variant="outline" className="w-full">
                    🚀 Create My Portfolio
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    🏠 Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

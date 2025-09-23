'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../../../components/ui/Button';

export default function AuthCodeErrorPage() {
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
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-gray-600">
              Sorry, we couldn't verify your email. The confirmation link may have expired or is invalid.
            </p>

            <div className="mt-6 space-y-4">
              <div className="text-sm text-gray-500">
                <p>This could happen if:</p>
                <ul className="mt-2 text-left list-disc list-inside space-y-1">
                  <li>The confirmation link has expired</li>
                  <li>The link has already been used</li>
                  <li>There was an issue with the email verification process</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <Link href="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Try Signing Up Again
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
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

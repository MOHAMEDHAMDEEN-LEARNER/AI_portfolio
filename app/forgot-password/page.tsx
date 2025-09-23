'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import { AuthService } from '../../lib/auth';

type Step = 'email' | 'otp' | 'newPassword';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthService.requestPasswordReset(email);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setCurrentStep('otp');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Reset request error:', error);
      setMessage({ type: 'error', text: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit verification code' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthService.resetPasswordWithOTP(email, otp, newPassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleRequestOTP} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
          placeholder="Enter your email address"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          We sent a 6-digit verification code to <strong>{email}</strong>
        </p>
        <button
          type="button"
          onClick={() => setCurrentStep('email')}
          className="text-blue-600 hover:underline text-sm mt-2"
        >
          Use different email
        </button>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 text-center text-2xl tracking-widest"
          placeholder="000000"
          maxLength={6}
          required
        />
        <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code from your email</p>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
          placeholder="Enter new password"
          minLength={6}
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
          placeholder="Confirm new password"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>

      <button
        type="button"
        onClick={handleRequestOTP}
        disabled={isLoading}
        className="w-full text-center text-sm text-blue-600 hover:underline disabled:opacity-50"
      >
        Didn&apos;t receive the code? Resend
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-gray-600">
            {currentStep === 'email' 
              ? 'Enter your email to receive a reset code'
              : 'Enter the code and your new password'
            }
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

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'email' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep === 'otp' ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'otp' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Email</span>
              <span>Reset</span>
            </div>
          </div>

          {/* Form Content */}
          {currentStep === 'email' ? renderEmailStep() : renderOTPStep()}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
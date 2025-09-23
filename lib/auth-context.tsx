'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from './supabase';
import { AuthUtils } from './auth-utils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: (redirectTo?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Show success messages for auth events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in successfully');
        }
        if (event === 'SIGNED_OUT') {
          console.log('✅ User signed out successfully');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);  const signOut = async (redirectTo?: string) => {
    try {
      console.log('🔵 Starting signout process...');
      
      // Clear local state immediately for better UX
      setUser(null);
      setSession(null);
      
      // Use safe signout utility
      const result = await AuthUtils.safeSignOut();
      
      if (!result.success) {
        console.error('🔴 Supabase signout error:', result.error);
        // Clear local auth data as fallback
        AuthUtils.clearLocalAuth();
        console.log('⚠️ Cleared local auth data as fallback');
      } else {
        console.log('✅ Signout successful');
      }
      
      // Show success message
      if (typeof window !== 'undefined') {
        console.log('✅ Successfully signed out');
      }
    } catch (networkError) {
      console.error('🔴 Network error during signout:', networkError);
      // Clear local auth data as fallback
      AuthUtils.clearLocalAuth();
      console.log('⚠️ Network error handled, cleared local data');
    }    // Always perform redirect logic regardless of API call success
    try {
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        // Determine where to redirect after signout
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          // Always redirect to login page after signout with success message
          router.push('/login?signedout=true');
        }
      }, 100);
    } catch (redirectError) {
      console.error('🔴 Redirect error after signout:', redirectError);
      // Fallback to login page if redirect fails
      window.location.href = '/login?signedout=true';
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

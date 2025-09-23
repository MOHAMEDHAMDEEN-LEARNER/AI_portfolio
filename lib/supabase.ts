import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Add timeout and retry options
    flowType: 'pkce'
  },
  global: {
    // Add timeout for network requests
    headers: {
      'X-Client-Info': 'ai-portfolio-generator'
    }
  },
  realtime: {
    // Disable realtime if not needed to reduce connection issues
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types
export interface UserProfile {
  id: string
  email: string
  full_name: string
  mobile_number?: string
  student_id?: string
  course?: string
  year_of_graduation?: string
  college_name?: string
  linkedin_profile?: string
  github_profile?: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
-- AI Portfolio Generator Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing user_profiles table if it exists to recreate with better structure
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create comprehensive user_profiles table with all signup data
CREATE TABLE public.user_profiles (
    -- Primary key linking to auth.users
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- Authentication & Contact Info
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- For reference (actual password is in auth.users)
    
    -- Personal Information (from signup form)
    full_name TEXT NOT NULL,
    mobile_number TEXT,
    
    -- Academic Information
    student_id TEXT,
    course TEXT,
    year_of_graduation INTEGER,
    college_name TEXT,
    
    -- Professional/Social Profiles
    linkedin_profile TEXT,
    github_profile TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    
    -- Profile Metadata
    avatar_url TEXT,
    bio TEXT,
    skills TEXT[], -- Array of skills
    
    -- Account Status
    profile_completed BOOLEAN DEFAULT FALSE,
    account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create portfolio_generations table for tracking user's portfolio generation requests
CREATE TABLE IF NOT EXISTS public.portfolio_generations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    template_id TEXT NOT NULL,
    resume_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    additional_info TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    generated_portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_generations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles (drop existing ones first)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for portfolio_generations (drop existing ones first)
DROP POLICY IF EXISTS "Users can view their own portfolio generations" ON public.portfolio_generations;
DROP POLICY IF EXISTS "Users can insert their own portfolio generations" ON public.portfolio_generations;
DROP POLICY IF EXISTS "Users can update their own portfolio generations" ON public.portfolio_generations;

CREATE POLICY "Users can view their own portfolio generations" ON public.portfolio_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio generations" ON public.portfolio_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio generations" ON public.portfolio_generations
    FOR UPDATE USING (auth.uid() = user_id);

-- Create improved function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert comprehensive user profile with all signup data
    INSERT INTO public.user_profiles (
        id, 
        email, 
        password_hash,
        full_name,
        mobile_number,
        student_id,
        course,
        year_of_graduation,
        college_name,
        linkedin_profile,
        github_profile,
        profile_completed
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.encrypted_password, -- Store reference to hashed password
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.raw_user_meta_data->>'mobile_number',
        NEW.raw_user_meta_data->>'student_id',
        NEW.raw_user_meta_data->>'course',
        CASE 
            WHEN NEW.raw_user_meta_data->>'year_of_graduation' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'year_of_graduation')::INTEGER 
            ELSE NULL 
        END,
        NEW.raw_user_meta_data->>'college_name',
        NEW.raw_user_meta_data->>'linkedin_profile',
        NEW.raw_user_meta_data->>'github_profile',
        CASE 
            WHEN NEW.raw_user_meta_data->>'full_name' IS NOT NULL 
            AND NEW.raw_user_meta_data->>'course' IS NOT NULL 
            THEN TRUE 
            ELSE FALSE 
        END
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_portfolio_generations
    BEFORE UPDATE ON public.portfolio_generations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance and easier data viewing
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name ON public.user_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_course ON public.user_profiles(course);
CREATE INDEX IF NOT EXISTS idx_user_profiles_college ON public.user_profiles(college_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_graduation_year ON public.user_profiles(year_of_graduation);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_generations_user_id ON public.portfolio_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_generations_status ON public.portfolio_generations(status);

-- Grant necessary permissions for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.portfolio_generations TO authenticated;

-- Create a view for easy data viewing (optional - makes data more readable)
CREATE OR REPLACE VIEW public.user_profiles_readable AS
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.mobile_number,
    up.student_id,
    up.course,
    up.year_of_graduation,
    up.college_name,
    up.linkedin_profile,
    up.github_profile,
    up.profile_completed,
    up.account_status,
    up.created_at,
    up.updated_at,
    up.last_login,
    au.created_at as auth_created_at,
    au.email_confirmed_at,
    au.last_sign_in_at
FROM public.user_profiles up
JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at DESC;
-- STEP 2: Create the clean database structure
-- Run this after step1_cleanup.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table with all signup form data
CREATE TABLE public.user_profiles (
    -- Primary key linking to auth.users
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- Authentication & Contact Info
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Reference to hashed password
    
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

-- Create portfolio tables for normalized portfolio data structure
-- This replaces the single portfolio_generations table with a proper relational structure

-- 1. Create the main table for the portfolio/resume.
-- This table holds all the top-level, single-value information.
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    summary TEXT,
    template_id TEXT DEFAULT 'default',
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    generated_portfolio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create a table for skills.
-- This creates a one-to-many relationship: one portfolio can have many skills.
CREATE TABLE public.skills (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL
);

-- 3. Create a table for work experience.
-- One portfolio can have multiple work experiences.
CREATE TABLE public.experiences (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    role TEXT,
    company TEXT,
    dates TEXT,
    -- Use TEXT[] to store an array of responsibility strings.
    responsibilities TEXT[]
);

-- 4. Create a table for education history.
-- One portfolio can have multiple education entries.
CREATE TABLE public.education (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    degree TEXT,
    institution TEXT,
    dates TEXT
);

-- 5. Create a table for projects.
-- One portfolio can have multiple projects.
CREATE TABLE public.projects (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    name TEXT,
    description TEXT,
    -- Use TEXT[] to store an array of technology strings.
    technologies TEXT[]
);
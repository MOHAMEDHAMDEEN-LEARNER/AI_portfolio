-- STEP 1: Run this first to clean up existing setup
-- Clean Database Setup - Safe for both fresh and existing databases

-- Drop existing triggers first (safe with IF EXISTS)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing functions (safe with IF EXISTS)
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop existing tables (safe with IF EXISTS and CASCADE)
-- This will automatically drop all policies, triggers, and constraints
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.education CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.portfolios CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.portfolio_generations CASCADE;

-- Clean up any remaining objects
DO $$ 
BEGIN
    -- This block handles any cleanup that might be needed
    -- but won't fail if objects don't exist
    NULL;
END $$;
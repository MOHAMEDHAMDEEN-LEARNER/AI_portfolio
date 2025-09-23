-- STEP 4: Set up security and permissions
-- Run this after step3_functions_triggers.sql

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for portfolios
CREATE POLICY "Users can view their own portfolios" ON public.portfolios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolios" ON public.portfolios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" ON public.portfolios
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for skills
CREATE POLICY "Users can view their own skills" ON public.skills
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can insert their own skills" ON public.skills
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can update their own skills" ON public.skills
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can delete their own skills" ON public.skills
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

-- Create policies for experiences
CREATE POLICY "Users can view their own experiences" ON public.experiences
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can insert their own experiences" ON public.experiences
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can update their own experiences" ON public.experiences
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can delete their own experiences" ON public.experiences
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

-- Create policies for education
CREATE POLICY "Users can view their own education" ON public.education
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can insert their own education" ON public.education
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can update their own education" ON public.education
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can delete their own education" ON public.education
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

-- Create policies for projects
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can insert their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_full_name ON public.user_profiles(full_name);
CREATE INDEX idx_user_profiles_course ON public.user_profiles(course);
CREATE INDEX idx_user_profiles_college ON public.user_profiles(college_name);
CREATE INDEX idx_user_profiles_graduation_year ON public.user_profiles(year_of_graduation);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(account_status);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);

-- Portfolio indexes
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_status ON public.portfolios(status);
CREATE INDEX idx_portfolios_created_at ON public.portfolios(created_at);

-- Related tables indexes
CREATE INDEX idx_skills_portfolio_id ON public.skills(portfolio_id);
CREATE INDEX idx_skills_name ON public.skills(name);
CREATE INDEX idx_experiences_portfolio_id ON public.experiences(portfolio_id);
CREATE INDEX idx_experiences_company ON public.experiences(company);
CREATE INDEX idx_education_portfolio_id ON public.education(portfolio_id);
CREATE INDEX idx_education_institution ON public.education(institution);
CREATE INDEX idx_projects_portfolio_id ON public.projects(portfolio_id);
CREATE INDEX idx_projects_name ON public.projects(name);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.portfolios TO authenticated;
GRANT ALL ON public.skills TO authenticated;
GRANT ALL ON public.experiences TO authenticated;
GRANT ALL ON public.education TO authenticated;
GRANT ALL ON public.projects TO authenticated;
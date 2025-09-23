-- STEP 3: Create functions and triggers
-- Run this after step2_create_tables.sql

-- Create function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
        NEW.encrypted_password,
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
        RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_portfolios
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
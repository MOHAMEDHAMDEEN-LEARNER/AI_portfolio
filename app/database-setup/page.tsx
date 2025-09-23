export default function DatabaseSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Database Setup Required
          </h1>
          <p className="text-lg text-gray-600">
            To complete your authentication setup, you need to deploy the database schema to Supabase.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Setup Instructions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 1: Go to Supabase Dashboard</h3>
              <p className="text-gray-600">
                Visit <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://supabase.com/dashboard</a> and select your project.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 2: Open SQL Editor</h3>
              <p className="text-gray-600">
                In your Supabase dashboard, navigate to <strong>SQL Editor</strong> from the left sidebar.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 3: Run the Schema</h3>
              <p className="text-gray-600 mb-3">
                Copy and paste the following SQL code into the SQL Editor and click <strong>Run</strong>:
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`-- AI Portfolio Generator Database Schema
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    mobile_number TEXT,
    student_id TEXT,
    course TEXT,
    year_of_graduation TEXT,
    college_name TEXT,
    linkedin_profile TEXT,
    github_profile TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create portfolio_generations table
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

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for portfolio_generations
CREATE POLICY "Users can view their own portfolio generations" ON public.portfolio_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio generations" ON public.portfolio_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio generations" ON public.portfolio_generations
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
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
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();`}</pre>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 4: Verify Setup</h3>
              <p className="text-gray-600">
                After running the SQL, you should see the tables created in your <strong>Table Editor</strong>. 
                You can then test the signup and login functionality.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 What This Sets Up</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>user_profiles</strong> table for storing user information</li>
            <li>• <strong>portfolio_generations</strong> table for tracking portfolio requests</li>
            <li>• <strong>Row Level Security</strong> policies for data protection</li>
            <li>• <strong>Automatic triggers</strong> for profile creation and timestamps</li>
            <li>• <strong>Database functions</strong> for user management</li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <a 
            href="/signup" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← Back to Signup
          </a>
        </div>
      </div>
    </div>
  )
}
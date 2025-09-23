import { supabase } from './supabase';

// Database types matching the schema
export interface Portfolio {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  summary: string | null;
  template_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generated_portfolio_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  portfolio_id: string;
  skill_name: string;
}

export interface Experience {
  id: number;
  portfolio_id: string;
  role: string | null;
  company: string | null;
  dates: string | null;
  responsibilities: string[] | null;
}

export interface Education {
  id: number;
  portfolio_id: string;
  degree: string | null;
  institution: string | null;
  dates: string | null;
}

export interface Project {
  id: number;
  portfolio_id: string;
  name: string | null;
  description: string | null;
  technologies: string[] | null;
}

// Complete portfolio data structure for the template
export interface PortfolioData {
  // Main portfolio info
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  linkedin_url?: string;
  github_url?: string;
  summary: string;
  template_id: string;
  status: string;
  
  // Related data
  skills: string[];
  experiences: Array<{
    role: string;
    company: string;
    dates: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    dates: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export class PortfolioService {
  /**
   * Fetch complete portfolio data for a user
   */
  static async getPortfolioByUserId(userId: string): Promise<PortfolioData | null> {
    try {
      // Fetch main portfolio data
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (portfolioError || !portfolio) {
        console.log('No portfolio found for user:', userId);
        return null;
      }

      // Fetch related data in parallel
      const [skillsResult, experiencesResult, educationResult, projectsResult] = await Promise.all([
        supabase.from('skills').select('*').eq('portfolio_id', portfolio.id),
        supabase.from('experiences').select('*').eq('portfolio_id', portfolio.id),
        supabase.from('education').select('*').eq('portfolio_id', portfolio.id),
        supabase.from('projects').select('*').eq('portfolio_id', portfolio.id)
      ]);

      // Transform the data to match the template interface
      const portfolioData: PortfolioData = {
        id: portfolio.id,
        user_id: portfolio.user_id,
        name: portfolio.name || '',
        email: portfolio.email || '',
        phone: portfolio.phone || '',
        linkedin_url: portfolio.linkedin_url || undefined,
        github_url: portfolio.github_url || undefined,
        summary: portfolio.summary || '',
        template_id: portfolio.template_id,
        status: portfolio.status,
        
        skills: skillsResult.data?.map(skill => skill.skill_name) || [],
        
        experiences: experiencesResult.data?.map(exp => ({
          role: exp.role || '',
          company: exp.company || '',
          dates: exp.dates || '',
          responsibilities: exp.responsibilities || []
        })) || [],
        
        education: educationResult.data?.map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          dates: edu.dates || ''
        })) || [],
        
        projects: projectsResult.data?.map(proj => ({
          name: proj.name || '',
          description: proj.description || '',
          technologies: proj.technologies || []
        })) || []
      };

      return portfolioData;
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      return null;
    }
  }

  /**
   * Create a new portfolio with all related data
   */
  static async createPortfolio(
    userId: string, 
    portfolioData: Omit<PortfolioData, 'id' | 'user_id'>
  ): Promise<string | null> {
    try {
      // Start a transaction-like approach
      // 1. Create main portfolio record
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .insert({
          user_id: userId,
          name: portfolioData.name,
          email: portfolioData.email,
          phone: portfolioData.phone,
          linkedin_url: portfolioData.linkedin_url,
          github_url: portfolioData.github_url,
          summary: portfolioData.summary,
          template_id: portfolioData.template_id,
          status: 'completed'
        })
        .select('id')
        .single();

      if (portfolioError || !portfolio) {
        throw new Error('Failed to create portfolio: ' + portfolioError?.message);
      }

      const portfolioId = portfolio.id;

      // 2. Create skills
      if (portfolioData.skills.length > 0) {
        const skillsToInsert = portfolioData.skills.map(skill => ({
          portfolio_id: portfolioId,
          skill_name: skill
        }));

        const { error: skillsError } = await supabase
          .from('skills')
          .insert(skillsToInsert);

        if (skillsError) {
          console.error('Error inserting skills:', skillsError);
        }
      }

      // 3. Create experiences
      if (portfolioData.experiences.length > 0) {
        const experiencesToInsert = portfolioData.experiences.map(exp => ({
          portfolio_id: portfolioId,
          role: exp.role,
          company: exp.company,
          dates: exp.dates,
          responsibilities: exp.responsibilities
        }));

        const { error: experiencesError } = await supabase
          .from('experiences')
          .insert(experiencesToInsert);

        if (experiencesError) {
          console.error('Error inserting experiences:', experiencesError);
        }
      }

      // 4. Create education
      if (portfolioData.education.length > 0) {
        const educationToInsert = portfolioData.education.map(edu => ({
          portfolio_id: portfolioId,
          degree: edu.degree,
          institution: edu.institution,
          dates: edu.dates
        }));

        const { error: educationError } = await supabase
          .from('education')
          .insert(educationToInsert);

        if (educationError) {
          console.error('Error inserting education:', educationError);
        }
      }

      // 5. Create projects
      if (portfolioData.projects.length > 0) {
        const projectsToInsert = portfolioData.projects.map(proj => ({
          portfolio_id: portfolioId,
          name: proj.name,
          description: proj.description,
          technologies: proj.technologies
        }));

        const { error: projectsError } = await supabase
          .from('projects')
          .insert(projectsToInsert);

        if (projectsError) {
          console.error('Error inserting projects:', projectsError);
        }
      }

      return portfolioId;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      return null;
    }
  }

  /**
   * Update portfolio data
   */
  static async updatePortfolio(
    portfolioId: string,
    updates: Partial<PortfolioData>
  ): Promise<boolean> {
    try {
      // Update main portfolio table
      const mainUpdates: Record<string, unknown> = {};
      const fieldsToUpdate = ['name', 'email', 'phone', 'linkedin_url', 'github_url', 'summary', 'template_id', 'status'];
      
      fieldsToUpdate.forEach(field => {
        if (updates[field as keyof PortfolioData] !== undefined) {
          mainUpdates[field] = updates[field as keyof PortfolioData];
        }
      });

      if (Object.keys(mainUpdates).length > 0) {
        mainUpdates.updated_at = new Date().toISOString();
        
        const { error: portfolioError } = await supabase
          .from('portfolios')
          .update(mainUpdates)
          .eq('id', portfolioId);

        if (portfolioError) {
          throw new Error('Failed to update portfolio: ' + portfolioError.message);
        }
      }

      // Handle skills update if provided
      if (updates.skills) {
        // Delete existing skills
        await supabase.from('skills').delete().eq('portfolio_id', portfolioId);
        
        // Insert new skills
        if (updates.skills.length > 0) {
          const skillsToInsert = updates.skills.map(skill => ({
            portfolio_id: portfolioId,
            skill_name: skill
          }));

          await supabase.from('skills').insert(skillsToInsert);
        }
      }

      // Similar updates for experiences, education, and projects can be added here
      // For now, focusing on the core functionality

      return true;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      return false;
    }
  }

  /**
   * Delete a portfolio and all related data
   */
  static async deletePortfolio(portfolioId: string): Promise<boolean> {
    try {
      // Due to CASCADE DELETE constraints, deleting the portfolio will automatically
      // delete all related skills, experiences, education, and projects
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);

      if (error) {
        throw new Error('Failed to delete portfolio: ' + error.message);
      }

      return true;
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      return false;
    }
  }

  /**
   * Get all portfolios for a user
   */
  static async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch user portfolios: ' + error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user portfolios:', error);
      return [];
    }
  }

  /**
   * Check if database tables exist and are accessible
   */
  static async checkDatabaseConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to query each table to ensure they exist and are accessible
      const [portfolioTest, skillsTest, experiencesTest, educationTest, projectsTest] = await Promise.all([
        supabase.from('portfolios').select('id').limit(1),
        supabase.from('skills').select('id').limit(1),
        supabase.from('experiences').select('id').limit(1),
        supabase.from('education').select('id').limit(1),
        supabase.from('projects').select('id').limit(1)
      ]);

      const errors = [portfolioTest.error, skillsTest.error, experiencesTest.error, educationTest.error, projectsTest.error]
        .filter(error => error !== null);

      if (errors.length > 0) {
        return { 
          success: false, 
          error: `Database tables not accessible: ${errors.map(e => e?.message).join(', ')}` 
        };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}
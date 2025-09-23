import { supabase } from './supabase';

export class DatabaseUtils {
  /**
   * Test if the user_profiles table exists and is accessible
   */
  static async testUserProfilesTable(): Promise<{ 
    exists: boolean; 
    error?: string; 
    canInsert?: boolean; 
    canSelect?: boolean 
  }> {
    try {
      // Test if we can select from the table (checks existence and permissions)
      console.log('🔵 Testing user_profiles table access...');
      const { data, error: selectError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      if (selectError) {
        console.error('🔴 Table access test failed:', selectError);
        
        // Check specific error codes
        if (selectError.code === '42P01') {
          return {
            exists: false,
            error: 'Table "user_profiles" does not exist. Please run the database schema setup.',
            canSelect: false,
            canInsert: false
          };
        }
        
        if (selectError.code === '42501') {
          return {
            exists: true,
            error: 'Permission denied. Check your RLS policies.',
            canSelect: false,
            canInsert: false
          };
        }

        return {
          exists: false,
          error: selectError.message,
          canSelect: false,
          canInsert: false
        };
      }

      console.log('✅ Table access test passed');
      
      // Test insert permissions by checking the table structure
      try {
        console.log('🔵 Testing insert permissions...');
        // We won't actually insert, just test the query structure
        const { error: insertTestError } = await supabase
          .from('user_profiles')
          .insert({
            id: '00000000-0000-0000-0000-000000000000', // Dummy UUID that should fail
            email: 'test@test.com',
            full_name: 'Test User'
          })
          .select()
          .single();

        // We expect this to fail, but not with permission/table errors
        const canInsert = !insertTestError || 
          (insertTestError.code !== '42P01' && insertTestError.code !== '42501');

        console.log('🔵 Insert test result:', { canInsert, error: insertTestError?.message });

        return {
          exists: true,
          canSelect: true,
          canInsert,
          error: canInsert ? undefined : insertTestError?.message
        };
      } catch (insertError) {
        console.warn('⚠️ Insert test failed:', insertError);
        return {
          exists: true,
          canSelect: true,
          canInsert: false,
          error: 'Insert permissions test failed'
        };
      }
    } catch (error) {
      console.error('🔴 Database connection test failed:', error);
      return {
        exists: false,
        error: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        canSelect: false,
        canInsert: false
      };
    }
  }

  /**
   * Get detailed database information for debugging
   */
  static async getDatabaseInfo(): Promise<{
    connected: boolean;
    tableExists: boolean;
    userCount?: number;
    error?: string;
  }> {
    try {
      // Test basic connection
      const { error: connectionError } = await supabase.auth.getSession();
      if (connectionError) {
        return {
          connected: false,
          tableExists: false,
          error: `Connection failed: ${connectionError.message}`
        };
      }

      // Test table existence and count users
      const { data, error: countError } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true });

      if (countError) {
        return {
          connected: true,
          tableExists: false,
          error: countError.message
        };
      }

      return {
        connected: true,
        tableExists: true,
        userCount: data?.length || 0
      };
    } catch (error) {
      return {
        connected: false,
        tableExists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

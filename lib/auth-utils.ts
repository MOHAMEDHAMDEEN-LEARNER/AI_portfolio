import { supabase } from './supabase';

export class AuthUtils {
  /**
   * Test Supabase connection
   */
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (networkError) {
      return { 
        success: false, 
        error: `Network error: ${networkError instanceof Error ? networkError.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Safe signout with better error handling
   */
  static async safeSignOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (networkError) {
      // Even if network fails, we can consider it successful
      // since the user wants to sign out anyway
      console.warn('Network error during signout, proceeding with local logout:', networkError);
      return { success: true };
    }
  }
  /**
   * Clear all local auth data (for when API calls fail)
   */
  static clearLocalAuth() {
    try {
      // Clear local storage data that Supabase might have stored
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('supabase') || key.includes('auth') || key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        });
        
        // Also clear session storage
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
          if (key.startsWith('supabase') || key.includes('auth') || key.startsWith('sb-')) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.warn('Could not clear local storage:', error);
    }
  }  /**
   * Force logout - clears everything and reloads page
   */
  static forceLogout() {
    try {
      this.clearLocalAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login?signedout=true';
      }
    } catch (error) {
      console.error('Force logout failed:', error);
    }
  }
}

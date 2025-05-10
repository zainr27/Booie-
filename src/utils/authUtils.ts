
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Cleans up authentication state in local/session storage
 * Prevents auth "limbo" states during sign-in/sign-out operations
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Performs a robust sign out operation that clears all auth state
 * and attempts a global sign out
 */
export const performSignOut = async (): Promise<void> => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.error('Global sign-out failed, continuing anyway', err);
    }
    
    // Return success regardless of supabase signout result
    return Promise.resolve();
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error signing out",
      description: error.message || "Failed to sign out. Please try again.",
    });
    return Promise.reject(error);
  }
};

/**
 * Checks if a user has completed onboarding by querying the profiles table
 */
export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
    
    return data?.onboarding_completed ?? false;
  } catch (error) {
    console.error('Error in checkOnboardingStatus:', error);
    return false;
  }
};

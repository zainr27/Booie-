
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cleanupAuthState } from "@/utils/authUtils";

export const signInWithPassword = async (email: string, password: string) => {
  try {
    // Clean up existing state before attempting sign in
    cleanupAuthState();
    
    // Attempt global sign out first to clear any existing sessions
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    // Will redirect via the auth state change listener
    return { success: true };
  } catch (error: any) {
    toast({
      variant: "destructive", 
      title: "Error signing in",
      description: error.message,
    });
    return { success: false, error };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    // Clean up existing state before attempting sign up
    cleanupAuthState();
    
    // Get the current origin (hostname including protocol) for the redirect URL
    const redirectTo = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: "",
          last_name: "",
        },
        emailRedirectTo: redirectTo, // Use dynamic redirect based on current origin
      },
    });
    
    if (error) throw error;
    
    toast({
      title: "Check your email",
      description: "We've sent you a verification link. Please check your email to complete sign up.",
    });
    return { success: true };
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error creating account",
      description: error.message,
    });
    return { success: false, error };
  }
};

export const resetPassword = async (email: string) => {
  if (!email) {
    toast({
      variant: "destructive",
      title: "Email required",
      description: "Please enter your email to reset your password",
    });
    return { success: false };
  }
  
  try {
    // Get the current origin (hostname including protocol) for the redirect URL
    const redirectTo = `${window.location.origin}/auth?tab=update-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo, // Use dynamic redirect based on current origin
    });
    
    if (error) throw error;
    
    toast({
      title: "Check your email",
      description: "We've sent you a password reset link. Please check your email.",
    });
    return { success: true };
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error resetting password",
      description: error.message,
    });
    return { success: false, error };
  }
};

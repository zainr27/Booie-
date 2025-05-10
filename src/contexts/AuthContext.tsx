
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkOnboardingStatus, performSignOut } from '@/utils/authUtils';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Set up auth state listener first to capture all auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Update session and user state synchronously
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle signed in event
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Defer data fetching to prevent deadlocks
            setTimeout(async () => {
              const onboardingCompleted = await checkOnboardingStatus(session.user.id);
              setHasCompletedOnboarding(onboardingCompleted);
              setLoading(false);
            }, 0);
          } catch (error) {
            console.error('Error checking onboarding status:', error);
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setHasCompletedOnboarding(false);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    // Get initial session after setting up listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if the user has completed onboarding
        checkOnboardingStatus(session.user.id)
          .then(onboardingCompleted => {
            setHasCompletedOnboarding(onboardingCompleted);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching profile:', error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    loading,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    signOut: performSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

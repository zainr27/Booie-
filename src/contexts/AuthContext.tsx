
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user logged in, check onboarding status
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Defer data fetching to prevent deadlocks
            setTimeout(async () => {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching user profile:', error);
              } else {
                setHasCompletedOnboarding(profileData?.onboarding_completed ?? false);
              }
              
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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if the user has completed onboarding
        supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
            } else {
              setHasCompletedOnboarding(data?.onboarding_completed ?? false);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    signOut,
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

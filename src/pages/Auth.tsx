
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/layout/PageTransition";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { GraduationCap } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sign-in");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Instead of navigating directly, we'll let the main routing handle the redirection
        // based on onboarding status
        navigate("/");
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // Let the main routing handle the redirection
          navigate("/");
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check URL parameters for tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    
    if (tab === "signup") {
      setActiveTab("sign-up");
    } else {
      setActiveTab("sign-in");
    }
  }, [location.search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without reloading the page
    const newUrl = value === "sign-up" 
      ? "/auth?tab=signup" 
      : "/auth";
    window.history.pushState({}, "", newUrl);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background bg-image-pattern">
        {/* Logo */}
        <div className="pt-8 pb-4 flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-3xl font-display font-bold text-foreground">Booie</span>
          </Link>
        </div>
        
        {/* Auth Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg border border-border/30 shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
                {activeTab === "sign-in" ? "Sign in to Booie" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                {activeTab === "sign-in" 
                  ? "Enter your credentials to access your account" 
                  : "Join us for better education financing"}
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in">
                <SignInForm
                  email={email}
                  setEmail={setEmail}
                  loading={loading}
                  setLoading={setLoading}
                />
              </TabsContent>
              
              <TabsContent value="sign-up">
                <SignUpForm
                  email={email}
                  setEmail={setEmail}
                  loading={loading}
                  setLoading={setLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;

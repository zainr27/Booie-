
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/layout/PageTransition";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

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
      <div className="min-h-screen flex">
        {/* Left section (form) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-600">Start your journey</h2>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {activeTab === "sign-in" ? "Sign in to Booie" : "Sign up to Booie"}
              </h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
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

        {/* Right section (gradient background) */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="h-full w-full bg-gradient-to-br from-blue-200 via-pink-200 to-blue-300 bg-opacity-90 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center">
              {/* You can add decorative elements here */}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;

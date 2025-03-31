
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Facebook, Github, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/layout/PageTransition";
import { motion } from "framer-motion";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sign-in");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/onboarding");
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/onboarding");
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Will redirect via the auth state change listener
    } catch (error: any) {
      toast({
        variant: "destructive", 
        title: "Error signing in",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email to reset your password",
      });
      return;
    }
    
    try {
      setLoading(true);
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error resetting password",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
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
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignIn} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email-signin" className="block text-sm font-medium text-blue-600">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Input
                        id="email-signin"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="pl-3 pr-10 py-3 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <Mail className="absolute right-3 top-3 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signin" className="block text-sm font-medium text-blue-600">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password-signin"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-3 pr-10 py-3 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? 
                          <EyeOff className="h-5 w-5" /> : 
                          <Eye className="h-5 w-5" />
                        }
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-150"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or sign in with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition duration-150"
                    >
                      <Facebook className="h-5 w-5 text-blue-600" />
                    </button>
                    <button
                      type="button"
                      className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition duration-150"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </button>
                    <button
                      type="button"
                      className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition duration-150"
                    >
                      <Github className="h-5 w-5" />
                    </button>
                  </div>
                </motion.form>
              </TabsContent>
              
              <TabsContent value="sign-up">
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignUp} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="block text-sm font-medium text-blue-600">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Input
                        id="email-signup"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="pl-3 pr-10 py-3 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <Mail className="absolute right-3 top-3 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="block text-sm font-medium text-blue-600">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-3 pr-10 py-3 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? 
                          <EyeOff className="h-5 w-5" /> : 
                          <Eye className="h-5 w-5" />
                        }
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-150"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or sign up with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition duration-150"
                    >
                      <Facebook className="h-5 w-5 text-blue-600" />
                    </button>
                    <button
                      type="button"
                      className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition duration-150"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </button>
                    <button
                      type="button"
                      className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition duration-150"
                    >
                      <Github className="h-5 w-5" />
                    </button>
                  </div>
                </motion.form>
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

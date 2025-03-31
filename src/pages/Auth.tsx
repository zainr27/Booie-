import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/layout/PageTransition";
import { motion } from "framer-motion";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/onboarding");
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/onboarding");
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    
    if (tab === "signup") {
      setActiveTab("sign-up");
    } else {
      setActiveTab("sign-in");
    }
  }, [location.search]);

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
      const redirectTo = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
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
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-600">Start your journey</h2>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Sign in to Booie
              </h1>
            </div>
            
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
            </motion.form>
          </div>
        </div>

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

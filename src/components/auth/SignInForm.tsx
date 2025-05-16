
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import { signInWithPassword, resetPassword } from "@/services/auth";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignInForm = ({ email, setEmail, loading, setLoading }: SignInFormProps) => {
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithPassword(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await resetPassword(email);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSignIn} 
      className="space-y-6"
    >
      <EmailInput 
        id="email-signin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <div className="space-y-2">
        <PasswordInput
          id="password-signin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
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
  );
};

export default SignInForm;

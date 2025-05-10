
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import { signUp } from "@/services/auth";

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignUpForm = ({ email, setEmail, loading, setLoading }: SignUpFormProps) => {
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password);
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
      onSubmit={handleSignUp} 
      className="space-y-6"
    >
      <EmailInput 
        id="email-signup"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <PasswordInput
        id="password-signup"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-150"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
    </motion.form>
  );
};

export default SignUpForm;

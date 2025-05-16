
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const PasswordInput = ({ 
  id, 
  label = "Password", 
  value, 
  onChange, 
  required = true 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
      </Label>
      <div className="relative group">
        <div className="absolute left-3 top-3 text-foreground/40 group-hover:text-primary/70 transition-colors">
          <Lock className="h-5 w-5" />
        </div>
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="pl-10 pr-10 py-3 w-full border rounded-lg bg-background/50 backdrop-blur-sm focus:ring-primary focus:border-primary transition-all duration-200 group-hover:border-primary/80"
          required={required}
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-foreground/40 hover:text-primary transition-colors"
        >
          {showPassword ? 
            <EyeOff className="h-5 w-5" /> : 
            <Eye className="h-5 w-5" />
          }
        </button>
      </div>
      <div className="text-xs text-foreground/50 pl-1 mt-1">
        {label === "Password" && "Use at least 8 characters with letters and numbers"}
      </div>
    </div>
  );
};

export default PasswordInput;


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

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
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="pl-3 pr-10 py-3 w-full border rounded-lg bg-background/50 focus:ring-primary focus:border-primary"
          required={required}
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-foreground/40 hover:text-foreground/70"
        >
          {showPassword ? 
            <EyeOff className="h-5 w-5" /> : 
            <Eye className="h-5 w-5" />
          }
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;

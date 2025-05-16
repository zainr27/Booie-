
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface EmailInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const EmailInput = ({ id, value, onChange, required = true }: EmailInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="block text-sm font-medium text-primary">
        E-mail Address
      </Label>
      <div className="relative group">
        <Input
          id={id}
          type="email"
          value={value}
          onChange={onChange}
          placeholder="example@email.com"
          className="pl-3 pr-10 py-3 w-full border rounded-lg bg-background/50 backdrop-blur-sm focus:ring-primary focus:border-primary transition-all duration-200 group-hover:border-primary/80"
          required={required}
        />
        <Mail className="absolute right-3 top-3 text-foreground/40 h-5 w-5 group-hover:text-primary/70 transition-colors" />
      </div>
    </div>
  );
};

export default EmailInput;


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
      <Label htmlFor={id} className="block text-sm font-medium text-blue-600">
        E-mail
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="email"
          value={value}
          onChange={onChange}
          placeholder="example@email.com"
          className="pl-3 pr-10 py-3 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required={required}
        />
        <Mail className="absolute right-3 top-3 text-gray-400 h-5 w-5" />
      </div>
    </div>
  );
};

export default EmailInput;


import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 bg-gradient-to-br from-muted/70 to-muted/30 hover:from-muted/90 hover:to-muted/50 backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-purple-700" />
      ) : (
        <Sun className="h-5 w-5 text-purple-400" />
      )}
    </Button>
  );
}

export default ThemeToggle;

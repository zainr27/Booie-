
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleAuthAction = async () => {
    if (user) {
      try {
        await signOut();
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account.",
        });
        // Force a page reload to clear any lingering state
        window.location.href = '/';
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message || "Failed to sign out. Please try again.",
        });
      }
    } else {
      navigate('/auth');
    }
  };

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <header className="border-b border-border/40 bg-background backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full transition-colors">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Left section: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <GraduationCap className="h-8 w-8 text-booie-600 dark:text-booie-400" />
            <span className="text-2xl font-bold text-booie-700 dark:text-booie-300 gradient-text">Booie</span>
          </Link>
        </div>
        
        {/* Center section: Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/income-projection" className="text-foreground/80 hover:text-primary font-medium transition-colors">
            Income Projection
          </Link>
          <Link to="/compare" className="text-foreground/80 hover:text-primary font-medium transition-colors">
            Plan Comparison
          </Link>
          <Link to="/fees" className="text-foreground/80 hover:text-primary font-medium transition-colors">
            Fee Structure
          </Link>
          <Link to="/faq" className="text-foreground/80 hover:text-primary font-medium transition-colors">
            FAQ
          </Link>
        </nav>
        
        {/* Right section: Authentication buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {!isHome && (
            <Button 
              variant="ghost" 
              className="font-medium"
              onClick={goToHomePage}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="font-medium"
            onClick={handleAuthAction}
          >
            {user ? 'Logout' : 'Login'}
          </Button>
          
          {!user && (
            <Link to="/auth?tab=signup">
              <Button className="font-medium bg-gradient-to-r from-booie-600 to-booie-500 hover:from-booie-700 hover:to-booie-600 border-0">
                Get Started
              </Button>
            </Link>
          )}
          
          {user && (
            <Link to="/dashboard">
              <Button className="font-medium bg-gradient-to-r from-booie-600 to-booie-500 hover:from-booie-700 hover:to-booie-600 border-0">
                Dashboard
              </Button>
            </Link>
          )}
          
          {/* Mobile menu toggle */}
          <button className="md:hidden text-foreground hover:text-primary">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

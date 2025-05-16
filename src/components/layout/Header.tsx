
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, Home, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  
  const handleAuthAction = async () => {
    if (user) {
      try {
        await signOut();
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account."
        });
        // Force a page reload to clear any lingering state
        window.location.href = '/';
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message || "Failed to sign out. Please try again."
        });
      }
    } else {
      navigate('/auth');
    }
  };
  
  const goToHomePage = () => {
    navigate('/');
  };
  
  return <header className="border-b bg-white">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Left section: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-booie-600" />
            <span className="text-2xl font-bold text-booie-700">Booie</span>
          </Link>
        </div>
        
        {/* Center section: Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/income-projection" className="text-gray-600 hover:text-booie-700 font-medium">
            Income Projection
          </Link>
          <Link to="/compare" className="text-gray-600 hover:text-booie-700 font-medium">
            Plan Comparison
          </Link>
          <Link to="/fees" className="text-gray-600 hover:text-booie-700 font-medium">
            Fee Structure
          </Link>
          <Link to="/faq" className="text-gray-600 hover:text-booie-700 font-medium">
            FAQ
          </Link>
          {user && <Link to="/admin" className="text-gray-600 hover:text-booie-700 font-medium flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Admin
          </Link>}
        </nav>
        
        {/* Right section: Authentication buttons */}
        <div className="flex items-center gap-4">
          {/* Only show Dashboard button when user is logged in and not on dashboard or home page */}
          {user && !isDashboard && !isHome && <Link to="/dashboard">
              
            </Link>}
          
          {/* Show logout button only if user is logged in */}
          {user && <Button variant="outline" className="font-medium" onClick={handleAuthAction}>
              Logout
            </Button>}
          
          {!user && <Link to="/auth?tab=signup">
              <Button className="font-medium bg-booie-600 hover:bg-booie-700">
                Get Started
              </Button>
            </Link>}
          
          {user && <Link to="/dashboard">
              <Button className="font-medium bg-booie-600 hover:bg-booie-700">
                Dashboard
              </Button>
            </Link>}
          
          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-600 hover:text-booie-700">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>;
};

export default Header;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b bg-white">
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
          <Link to="/loan-calculator" className="text-gray-600 hover:text-booie-700 font-medium">
            Loan Calculator
          </Link>
          <Link to="/comparison" className="text-gray-600 hover:text-booie-700 font-medium">
            Comparison
          </Link>
          <Link to="/fees" className="text-gray-600 hover:text-booie-700 font-medium">
            Fee Structure
          </Link>
          <Link to="/faq" className="text-gray-600 hover:text-booie-700 font-medium">
            FAQ
          </Link>
        </nav>
        
        {/* Right section: Authentication buttons */}
        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="outline" className="font-medium">
              Login
            </Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button className="font-medium bg-booie-600 hover:bg-booie-700">
              Get Started
            </Button>
          </Link>
          
          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-600 hover:text-booie-700">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

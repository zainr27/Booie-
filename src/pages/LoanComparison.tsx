
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import RateTable from '@/components/loan-comparison/RateTable';
import MitigantSidebar from '@/components/loan-comparison/MitigantSidebar';
import DisclosureFooter from '@/components/loan-comparison/DisclosureFooter';
import PersonalizedPlaceholder from '@/components/loan-comparison/PersonalizedPlaceholder';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUserPlan } from '@/hooks/use-user-plan';

// Define mitigant type
export type Mitigant = {
  id: string;
  label: string;
  description: string;
  bpsReduction: number;
};

// Updated mitigants with new options
const AVAILABLE_MITIGANTS: Mitigant[] = [
  {
    id: 'gpa',
    label: 'GPA > 3.5/4.0',
    description: 'Maintain a high academic performance',
    bpsReduction: 50, // 0.5%
  },
  {
    id: 'top_15_test',
    label: 'Top 15% test score',
    description: 'Score in the top 15% on standardized tests',
    bpsReduction: 75, // 0.75%
  },
  {
    id: 'top_5_test',
    label: 'Top 5% test score',
    description: 'Score in the top 5% on standardized tests',
    bpsReduction: 100, // 1%
  },
  {
    id: 'cosigner',
    label: 'Cosigner?',
    description: 'Add a qualified cosigner to your plan',
    bpsReduction: 75, // 0.75%
  },
  {
    id: 'internship',
    label: 'Internship?',
    description: 'Complete a relevant industry internship',
    bpsReduction: 50, // 0.5%
  },
  {
    id: 'return_offer',
    label: 'Return offer?',
    description: 'Secure a return offer from your internship',
    bpsReduction: 100, // 1%
  },
];

const LoanComparison = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPersonalized = location.pathname === '/compare/personalized';
  
  // Get user plan data if available
  const { plan, isLoading } = useUserPlan(isPersonalized && !!user);
  
  // State for selected mitigants in pre-login view
  const [selectedMitigants, setSelectedMitigants] = useState<string[]>([]);
  
  // Base max rate (placeholder - would come from API)
  const baseMaxRate = 10.0;
  
  // Calculate effective rate based on selected mitigants
  const calculateEffectiveRate = (baseRate: number, mitigantIds: string[]) => {
    const totalReduction = mitigantIds.reduce((total, id) => {
      const mitigant = AVAILABLE_MITIGANTS.find(m => m.id === id);
      return total + (mitigant?.bpsReduction || 0);
    }, 0);
    
    // Convert basis points to percentage points (100 bps = 1%)
    return Math.max(baseRate - (totalReduction / 100), 0).toFixed(2);
  };
  
  // Effective rate based on selected mitigants or user plan
  const effectiveRate = isPersonalized && plan 
    ? plan.maxRate.toFixed(2)
    : calculateEffectiveRate(baseMaxRate, selectedMitigants);
  
  // Handle mitigant selection
  const handleMitigantToggle = (mitigantId: string) => {
    setSelectedMitigants(prev => 
      prev.includes(mitigantId)
        ? prev.filter(id => id !== mitigantId)
        : [...prev, mitigantId]
    );
  };
  
  // Handle Apply CTA click
  const handleApplyClick = () => {
    // Log analytics event
    console.log('Analytics event: loan_compare_apply_clicked');
    
    // Navigate to apply page
    navigate('/apply');
  };
  
  return (
    <Layout>
      <div className="container-custom py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plan Comparison</h1>
          <p className="text-gray-600">
            Compare Booie's innovative financing with traditional student loans to find the best option for your education.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Mitigant Sidebar - first column on desktop, but rendered later for mobile */}
          <div className="order-2 md:order-1">
            {(!isPersonalized || (isPersonalized && plan && !plan.mitigants?.length)) && (
              <MitigantSidebar 
                mitigants={AVAILABLE_MITIGANTS}
                selectedMitigants={isPersonalized && plan ? plan.mitigants || [] : selectedMitigants}
                onToggle={handleMitigantToggle}
                readonly={isPersonalized && !!plan}
              />
            )}
          </div>
          
          {/* Rate Table - center column */}
          <div className="order-1 md:order-2 md:col-span-2">
            {isPersonalized && !plan && !isLoading ? (
              <PersonalizedPlaceholder />
            ) : (
              <RateTable 
                booieRate={effectiveRate}
                isPersonalized={isPersonalized}
              />
            )}
          </div>
        </div>
        
        {/* Detailed Comparison Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/compare/detailed" 
            className="text-booie-600 hover:text-booie-800 underline font-medium"
          >
            Want to see a year-by-year breakdown? Try our detailed payment simulator →
          </Link>
        </div>
        
        {/* ISA Disclosure */}
        <div className="mt-8 bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="text-sm text-gray-600 italic">
            Income share agreements, such as Booie plans, are considered student loans.
          </p>
        </div>
        
        {/* Apply CTA Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            className="w-full md:w-auto bg-booie-600 hover:bg-booie-700 text-white font-medium text-lg py-6 px-8"
            size="lg"
            onClick={handleApplyClick}
          >
            Apply for your Booie Plan
          </Button>
        </div>
        
        {/* Disclosure Footer */}
        <div className="mt-10">
          <DisclosureFooter />
        </div>
      </div>
    </Layout>
  );
};

export default LoanComparison;

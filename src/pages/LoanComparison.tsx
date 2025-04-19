
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Sample mitigants with BPS reductions
const AVAILABLE_MITIGANTS: Mitigant[] = [
  {
    id: 'upfront_payment',
    label: 'Up-front partial payment',
    description: 'Make a partial payment before your plan starts',
    bpsReduction: 75, // 0.75%
  },
  {
    id: 'scholarship',
    label: 'Program-specific scholarship',
    description: 'Apply with a qualifying scholarship',
    bpsReduction: 50, // 0.5%
  },
  {
    id: 'bonus_pledge',
    label: 'Sign-on bonus pledge',
    description: 'Commit to applying sign-on bonuses to your plan',
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
    
    // Navigate based on auth status
    if (user) {
      navigate('/loan-application');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <Layout>
      <div className="container-custom py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Loan Comparison</h1>
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
        
        {/* Apply CTA Button */}
        <div className="mt-8 sticky bottom-4 md:bottom-auto md:relative md:flex md:justify-end">
          <Button 
            className="w-full md:w-auto bg-booie-600 hover:bg-booie-700 text-white font-medium"
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

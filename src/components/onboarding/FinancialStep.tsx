import { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { PlanSummaryCard } from './PlanSummaryCard';

const FinancialStep = () => {
  const { data, updateFinancialData, setCurrentStep, saveAllData } = useOnboarding();
  const { setHasCompletedOnboarding } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAndSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validations for required fields
    if (data.financial.fundingRequired === null) {
      newErrors.fundingRequired = 'Funding required is required';
    }
    
    if (data.financial.maxTermYears === null) {
      newErrors.maxTermYears = 'Max term years is required';
    }
    
    if (data.financial.repaymentCapMultiple === null) {
      newErrors.repaymentCapMultiple = 'Repayment cap multiple is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Save all onboarding data
        await saveAllData();
        
        // Mark onboarding as complete
        setHasCompletedOnboarding(true);
        
        toast({
          title: "Onboarding complete!",
          description: "Your profile has been set up successfully.",
        });
        
        // Navigate to dashboard or home page
        navigate('/');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error saving profile",
          description: "There was a problem saving your information.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const years = Array.from({ length: 11 }, (_, i) => ({
    value: String(2025 + i),
    label: String(2025 + i)
  }));

  const standardizedTestScores = [
    "ACT ≥ 33",
    "SAT ≥ 1450",
    "LSAT ≥ 170",
    "GMAT ≥ 730",
    "MCAT ≥ 518"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your financial details</h2>
            <p className="text-sm text-gray-500">
              This helps us provide accurate loan calculations and income projections
            </p>
          </div>

          <div className="space-y-6">
            {/* Funding Required */}
            <div className="space-y-2">
              <Label htmlFor="fundingRequired" className="text-sm font-medium text-blue-600">
                Funding Required
              </Label>
              <div className="relative">
                <Input
                  id="fundingRequired"
                  type="number"
                  value={data.financial.fundingRequired || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : null;
                    updateFinancialData({ fundingRequired: value });
                  }}
                  className="pl-6"
                  placeholder="Amount needed for education"
                  max={50000}
                />
                <span className="absolute top-3 left-3 text-gray-500">$</span>
              </div>
              <p className="text-xs text-gray-500">Maximum amount: $50,000</p>
            </div>

            {/* Max Term Years with Tooltip */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="maxTermYears" className="text-sm font-medium text-blue-600">
                  Max Term Years
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum duration of your repayment period in years. Default is 10 years.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                id="maxTermYears"
                value={[data.financial.maxTermYears || 10]}
                min={3}
                max={20}
                step={1}
                onValueChange={(value) => {
                  updateFinancialData({ maxTermYears: value[0] });
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>3 years</span>
                <span>20 years</span>
              </div>
            </div>

            {/* Repayment Cap Multiple with Tooltip */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="repaymentCapMultiple" className="text-sm font-medium text-blue-600">
                  Repayment Cap Multiple
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum total repayment as a multiple of your loan amount. Default is 2.0×.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                id="repaymentCapMultiple"
                value={[data.financial.repaymentCapMultiple || 2]}
                min={1.5}
                max={2.5}
                step={0.1}
                onValueChange={(value) => {
                  updateFinancialData({ repaymentCapMultiple: value[0] });
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1.5×</span>
                <span>2.5×</span>
              </div>
            </div>

            {/* Rate-Reducing Factors */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-blue-600">Rate-Reducing Factors</Label>
              <p className="text-xs text-gray-500">
                Check any that apply to you. These factors may reduce your repayment rate.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highGPA"
                    checked={data.financial.highGPA}
                    onCheckedChange={(checked) => 
                      updateFinancialData({ highGPA: !!checked })
                    }
                  />
                  <Label htmlFor="highGPA">Cumulative GPA ≥ 3.5/4.0</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="topTestScore"
                    checked={data.financial.topTestScore}
                    onCheckedChange={(checked) => 
                      updateFinancialData({ topTestScore: !!checked })
                    }
                  />
                  <div className="flex items-center">
                    <Label htmlFor="topTestScore" className="mr-2">
                      I scored in the top 5% on a standardized test
                    </Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="h-4 w-4 text-gray-500" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium">Qualifying Test Scores:</h4>
                          <ul className="text-sm space-y-1">
                            {standardizedTestScores.map((score, index) => (
                              <li key={index}>{score}</li>
                            ))}
                          </ul>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasCosigner"
                    checked={data.financial.hasCosigner}
                    onCheckedChange={(checked) => 
                      updateFinancialData({ hasCosigner: !!checked })
                    }
                  />
                  <Label htmlFor="hasCosigner">Will have a cosigner</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasInternship"
                    checked={data.financial.hasInternship}
                    onCheckedChange={(checked) => 
                      updateFinancialData({ hasInternship: !!checked })
                    }
                  />
                  <Label htmlFor="hasInternship">Have relevant internship of 10+ weeks</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasReturnOffer"
                    checked={data.financial.hasReturnOffer}
                    onCheckedChange={(checked) => 
                      updateFinancialData({ hasReturnOffer: !!checked })
                    }
                  />
                  <Label htmlFor="hasReturnOffer">Have return offer from internship</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={validateAndSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column - Summary Card */}
        <div className="w-[400px]">
          <PlanSummaryCard />
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialStep;

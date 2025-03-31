
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const FinancialStep = () => {
  const { data, updateFinancialData, setCurrentStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (value: number | null) => {
    if (value === null) return '';
    return `$${value.toLocaleString()}`;
  };

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (data.financial.currentIncome === null) {
      newErrors.currentIncome = 'Current income is required';
    }
    
    if (data.financial.householdIncome === null) {
      newErrors.householdIncome = 'Household income is required';
    }
    
    if (data.financial.dependents === null) {
      newErrors.dependents = 'Number of dependents is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your financial information</h2>
        <p className="text-sm text-gray-500">
          This helps us provide accurate loan calculations and income projections
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentIncome" className="text-sm font-medium text-blue-600">
            Current Annual Income
          </Label>
          <div className="relative">
            <Input
              id="currentIncome"
              type="number"
              value={data.financial.currentIncome || ''}
              onChange={(e) => updateFinancialData({ 
                currentIncome: e.target.value ? parseInt(e.target.value) : null 
              })}
              className={`pl-6 ${errors.currentIncome ? 'border-red-500' : ''}`}
              placeholder="Your annual income"
            />
            <span className="absolute top-3 left-3 text-gray-500">$</span>
          </div>
          {errors.currentIncome && <p className="text-sm text-red-500">{errors.currentIncome}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="householdIncome" className="text-sm font-medium text-blue-600">
            Annual Household Income
          </Label>
          <div className="relative">
            <Input
              id="householdIncome"
              type="number"
              value={data.financial.householdIncome || ''}
              onChange={(e) => updateFinancialData({ 
                householdIncome: e.target.value ? parseInt(e.target.value) : null 
              })}
              className={`pl-6 ${errors.householdIncome ? 'border-red-500' : ''}`}
              placeholder="Total household income"
            />
            <span className="absolute top-3 left-3 text-gray-500">$</span>
          </div>
          {errors.householdIncome && <p className="text-sm text-red-500">{errors.householdIncome}</p>}
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="dependents" className="text-sm font-medium text-blue-600">
            Financial Dependents: {data.financial.dependents || 0}
          </Label>
          <Slider
            id="dependents"
            value={data.financial.dependents !== null ? [data.financial.dependents] : [0]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => updateFinancialData({ dependents: value[0] })}
            className={errors.dependents ? 'border-red-500 border rounded-lg p-2' : ''}
          />
          {errors.dependents && <p className="text-sm text-red-500">{errors.dependents}</p>}
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button 
          onClick={() => setCurrentStep(0)}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={validateAndNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default FinancialStep;

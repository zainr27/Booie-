
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const DemographicStep = () => {
  const { data, updateDemographicData, setCurrentStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.demographic.age) {
      newErrors.age = 'Age is required';
    }
    
    if (!data.demographic.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    if (!data.demographic.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(data.demographic.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(1);
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
        <h2 className="text-2xl font-bold tracking-tight">Tell us about yourself</h2>
        <p className="text-sm text-gray-500">
          This information helps us personalize your experience
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-blue-600">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            value={data.demographic.age || ''}
            onChange={(e) => updateDemographicData({ 
              age: e.target.value ? parseInt(e.target.value) : null 
            })}
            className={errors.age ? 'border-red-500' : ''}
            placeholder="Your age"
          />
          {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-blue-600">
            Gender
          </Label>
          <Select 
            value={data.demographic.gender}
            onValueChange={(value) => updateDemographicData({ gender: value })}
          >
            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ethnicity" className="text-sm font-medium text-blue-600">
            Race/Ethnicity (Optional)
          </Label>
          <Select 
            value={data.demographic.ethnicity}
            onValueChange={(value) => updateDemographicData({ ethnicity: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ethnicity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="black">Black or African American</SelectItem>
              <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
              <SelectItem value="native-american">Native American</SelectItem>
              <SelectItem value="pacific-islander">Pacific Islander</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm font-medium text-blue-600">
            ZIP Code
          </Label>
          <Input
            id="zipCode"
            value={data.demographic.zipCode}
            onChange={(e) => updateDemographicData({ zipCode: e.target.value })}
            className={errors.zipCode ? 'border-red-500' : ''}
            placeholder="Your ZIP code"
          />
          {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
        </div>
      </div>
      
      <Button 
        onClick={validateAndNext}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default DemographicStep;

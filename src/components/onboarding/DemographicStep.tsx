
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
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const totalQuestions = 4;

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

  // Show next question
  const showNextQuestion = () => {
    if (visibleQuestions < totalQuestions) {
      setVisibleQuestions(prev => prev + 1);
    }
  };

  // Animation variants for questions
  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
      
      <div className="space-y-6">
        {/* Age Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 1 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="age" className="text-sm font-medium text-blue-600">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            value={data.demographic.age || ''}
            onChange={(e) => {
              updateDemographicData({ 
                age: e.target.value ? parseInt(e.target.value) : null 
              });
              if (e.target.value) showNextQuestion();
            }}
            className={errors.age ? 'border-red-500' : ''}
            placeholder="Your age"
          />
          {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
        </motion.div>
        
        {/* Gender Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 2 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="gender" className="text-sm font-medium text-blue-600">
            Gender
          </Label>
          <Select 
            value={data.demographic.gender}
            onValueChange={(value) => {
              updateDemographicData({ gender: value });
              showNextQuestion();
            }}
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
        </motion.div>
        
        {/* Ethnicity Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 3 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="ethnicity" className="text-sm font-medium text-blue-600">
            Race/Ethnicity (Optional)
          </Label>
          <Select 
            value={data.demographic.ethnicity}
            onValueChange={(value) => {
              updateDemographicData({ ethnicity: value });
              showNextQuestion();
            }}
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
        </motion.div>
        
        {/* ZIP Code Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 4 ? "visible" : "hidden"}
          variants={questionVariants}
        >
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
        </motion.div>
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

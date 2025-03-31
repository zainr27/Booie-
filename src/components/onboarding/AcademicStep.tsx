
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { degreePrograms, schools } from '@/utils/incomeUtils';

const AcademicStep = () => {
  const { data, updateAcademicData, setCurrentStep, saveAllData } = useOnboarding();
  const { setHasCompletedOnboarding } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const validateAndSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.academic.school) {
      newErrors.school = 'School is required';
    }
    
    if (!data.academic.degreeProgram) {
      newErrors.degreeProgram = 'Degree program is required';
    }
    
    if (!data.academic.major) {
      newErrors.major = 'Major is required';
    }
    
    if (!data.academic.graduationYear) {
      newErrors.graduationYear = 'Graduation year is required';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your academic information</h2>
        <p className="text-sm text-gray-500">
          This helps us calculate your future income potential
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="school" className="text-sm font-medium text-blue-600">
            School
          </Label>
          <Select 
            value={data.academic.school}
            onValueChange={(value) => updateAcademicData({ school: value })}
          >
            <SelectTrigger className={errors.school ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.school && <p className="text-sm text-red-500">{errors.school}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="degreeProgram" className="text-sm font-medium text-blue-600">
            Degree Program
          </Label>
          <Select 
            value={data.academic.degreeProgram}
            onValueChange={(value) => updateAcademicData({ degreeProgram: value })}
          >
            <SelectTrigger className={errors.degreeProgram ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select degree program" />
            </SelectTrigger>
            <SelectContent>
              {degreePrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name} ({program.level})
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.degreeProgram && <p className="text-sm text-red-500">{errors.degreeProgram}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="major" className="text-sm font-medium text-blue-600">
            Major
          </Label>
          <Input
            id="major"
            value={data.academic.major}
            onChange={(e) => updateAcademicData({ major: e.target.value })}
            className={errors.major ? 'border-red-500' : ''}
            placeholder="Your major or field of study"
          />
          {errors.major && <p className="text-sm text-red-500">{errors.major}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="graduationYear" className="text-sm font-medium text-blue-600">
            Expected Graduation Year
          </Label>
          <Select 
            value={data.academic.graduationYear?.toString() || ''}
            onValueChange={(value) => updateAcademicData({ 
              graduationYear: parseInt(value) 
            })}
          >
            <SelectTrigger className={errors.graduationYear ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select graduation year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.graduationYear && <p className="text-sm text-red-500">{errors.graduationYear}</p>}
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
    </motion.div>
  );
};

export default AcademicStep;


import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { schools } from '@/utils/incomeUtils';

const AcademicStep = () => {
  const { data, updateAcademicData, setCurrentStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const totalQuestions = 4;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Simplified degree programs
  const degreePrograms = [
    { id: 'bachelors', name: "Bachelor's" },
    { id: 'masters', name: "Master's" },
    { id: 'phd', name: "PhD" }
  ];

  const validateAndNext = () => {
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
      setCurrentStep(2); // Go to financial step
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
        <h2 className="text-2xl font-bold tracking-tight">Your academic information</h2>
        <p className="text-sm text-gray-500">
          This helps us calculate your future income potential
        </p>
      </div>
      
      <div className="space-y-6">
        {/* School Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 1 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="school" className="text-sm font-medium text-blue-600">
            School
          </Label>
          <Select 
            value={data.academic.school}
            onValueChange={(value) => {
              updateAcademicData({ school: value });
              showNextQuestion();
            }}
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
        </motion.div>
        
        {/* Degree Program Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 2 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="degreeProgram" className="text-sm font-medium text-blue-600">
            Degree Program
          </Label>
          <Select 
            value={data.academic.degreeProgram}
            onValueChange={(value) => {
              updateAcademicData({ degreeProgram: value });
              showNextQuestion();
            }}
          >
            <SelectTrigger className={errors.degreeProgram ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select degree program" />
            </SelectTrigger>
            <SelectContent>
              {degreePrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.degreeProgram && <p className="text-sm text-red-500">{errors.degreeProgram}</p>}
        </motion.div>
        
        {/* Major Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 3 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="major" className="text-sm font-medium text-blue-600">
            Major
          </Label>
          <Input
            id="major"
            value={data.academic.major}
            onChange={(e) => {
              updateAcademicData({ major: e.target.value });
              if (e.target.value.length > 0) showNextQuestion();
            }}
            className={errors.major ? 'border-red-500' : ''}
            placeholder="Your major or field of study"
          />
          {errors.major && <p className="text-sm text-red-500">{errors.major}</p>}
        </motion.div>
        
        {/* Graduation Year Question */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 4 ? "visible" : "hidden"}
          variants={questionVariants}
        >
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
        </motion.div>
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
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default AcademicStep;

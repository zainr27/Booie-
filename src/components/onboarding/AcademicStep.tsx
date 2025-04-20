
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { schools } from '@/utils/incomeUtils';
import { 
  majors, 
  degreePrograms, 
  studyModes, 
  deliveryModes,
  getGraduationMonths,
  graduationYears 
} from '@/utils/academicConstants';

const AcademicStep = () => {
  const { data, updateAcademicData, setCurrentStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const [showCustomSchool, setShowCustomSchool] = useState(false);
  const [showCustomMajor, setShowCustomMajor] = useState(false);
  const totalQuestions = 7;

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

    if (!data.academic.graduationMonth) {
      newErrors.graduationMonth = 'Graduation month is required';
    }

    if (!data.academic.studyMode) {
      newErrors.studyMode = 'Study mode is required';
    }

    if (!data.academic.deliveryMode) {
      newErrors.deliveryMode = 'Delivery mode is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(2); // Go to financial step
    }
  };

  const showNextQuestion = () => {
    if (visibleQuestions < totalQuestions) {
      setVisibleQuestions(prev => prev + 1);
    }
  };

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
        {/* School Selection */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 1 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="school" className="text-sm font-medium text-blue-600">
            School
          </Label>
          {!showCustomSchool ? (
            <Select 
              value={data.academic.school}
              onValueChange={(value) => {
                if (value === 'other') {
                  setShowCustomSchool(true);
                  updateAcademicData({ school: '', isCustomSchool: true });
                } else {
                  updateAcademicData({ school: value, isCustomSchool: false });
                  showNextQuestion();
                }
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
          ) : (
            <Input
              value={data.academic.school}
              onChange={(e) => {
                updateAcademicData({ school: e.target.value });
                if (e.target.value) showNextQuestion();
              }}
              placeholder="Enter your school name"
              className={errors.school ? 'border-red-500' : ''}
            />
          )}
          {errors.school && <p className="text-sm text-red-500">{errors.school}</p>}
        </motion.div>
        
        {/* Degree Program */}
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
        
        {/* Major Selection */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 3 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="major" className="text-sm font-medium text-blue-600">
            Major
          </Label>
          {!showCustomMajor ? (
            <Select 
              value={data.academic.major}
              onValueChange={(value) => {
                if (value === 'other') {
                  setShowCustomMajor(true);
                  updateAcademicData({ major: '', isCustomMajor: true });
                } else {
                  updateAcademicData({ major: value, isCustomMajor: false });
                  showNextQuestion();
                }
              }}
            >
              <SelectTrigger className={errors.major ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your major" />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major.id} value={major.id}>
                    {major.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={data.academic.major}
              onChange={(e) => {
                updateAcademicData({ major: e.target.value });
                if (e.target.value) showNextQuestion();
              }}
              placeholder="Enter your major"
              className={errors.major ? 'border-red-500' : ''}
            />
          )}
          {errors.major && <p className="text-sm text-red-500">{errors.major}</p>}
        </motion.div>

        {/* Study Mode */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 4 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="studyMode" className="text-sm font-medium text-blue-600">
            Study Mode
          </Label>
          <Select 
            value={data.academic.studyMode}
            onValueChange={(value) => {
              updateAcademicData({ studyMode: value });
              showNextQuestion();
            }}
          >
            <SelectTrigger className={errors.studyMode ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select study mode" />
            </SelectTrigger>
            <SelectContent>
              {studyModes.map((mode) => (
                <SelectItem key={mode.id} value={mode.id}>
                  {mode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studyMode && <p className="text-sm text-red-500">{errors.studyMode}</p>}
        </motion.div>

        {/* Delivery Mode */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 5 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="deliveryMode" className="text-sm font-medium text-blue-600">
            Delivery Mode
          </Label>
          <Select 
            value={data.academic.deliveryMode}
            onValueChange={(value) => {
              updateAcademicData({ deliveryMode: value });
              showNextQuestion();
            }}
          >
            <SelectTrigger className={errors.deliveryMode ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select delivery mode" />
            </SelectTrigger>
            <SelectContent>
              {deliveryModes.map((mode) => (
                <SelectItem key={mode.id} value={mode.id}>
                  {mode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.deliveryMode && <p className="text-sm text-red-500">{errors.deliveryMode}</p>}
        </motion.div>

        {/* Graduation Month */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 6 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="graduationMonth" className="text-sm font-medium text-blue-600">
            Expected Graduation Month
          </Label>
          <Select 
            value={data.academic.graduationMonth?.toString()}
            onValueChange={(value) => {
              updateAcademicData({ graduationMonth: parseInt(value) });
              showNextQuestion();
            }}
          >
            <SelectTrigger className={errors.graduationMonth ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select graduation month" />
            </SelectTrigger>
            <SelectContent>
              {getGraduationMonths().map((month) => (
                <SelectItem key={month.id} value={month.id}>
                  {month.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.graduationMonth && <p className="text-sm text-red-500">{errors.graduationMonth}</p>}
        </motion.div>

        {/* Graduation Year */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 7 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="graduationYear" className="text-sm font-medium text-blue-600">
            Expected Graduation Year
          </Label>
          <Select 
            value={data.academic.graduationYear?.toString()}
            onValueChange={(value) => updateAcademicData({ 
              graduationYear: parseInt(value) 
            })}
          >
            <SelectTrigger className={errors.graduationYear ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select graduation year" />
            </SelectTrigger>
            <SelectContent>
              {graduationYears.map((year) => (
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

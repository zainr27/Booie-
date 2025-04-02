
import { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// Education mode options
const educationModes = [
  { value: 'full-time-in-person', label: 'Full-time in-person' },
  { value: 'part-time-in-person', label: 'Part-time in-person' },
  { value: 'full-time-online', label: 'Full-time online' },
  { value: 'part-time-online', label: 'Part-time online' },
  { value: 'full-time-hybrid', label: 'Full-time hybrid' },
  { value: 'part-time-hybrid', label: 'Part-time hybrid' },
];

const FinancialStep = () => {
  const { data, updateFinancialData, setCurrentStep, saveAllData } = useOnboarding();
  const { setHasCompletedOnboarding } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const totalQuestions = 12; // Updated total number of questions

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

  // Default graduation date (May 2026)
  const defaultGraduationDate = new Date(2026, 4, 15); // May 15, 2026
  const [graduationDate, setGraduationDate] = useState<Date | undefined>(defaultGraduationDate);
  const [employmentDate, setEmploymentDate] = useState<Date | undefined>(undefined);

  // Set default employment date one month after graduation
  useEffect(() => {
    if (graduationDate) {
      const employmentDefaultDate = new Date(graduationDate);
      employmentDefaultDate.setMonth(employmentDefaultDate.getMonth() + 1);
      setEmploymentDate(employmentDefaultDate);
      updateFinancialData({ 
        graduationDate: graduationDate.toISOString(),
        employmentDate: employmentDefaultDate.toISOString()
      });
    }
  }, [graduationDate]);

  // Rate reducing factors
  const [highGPA, setHighGPA] = useState(false);
  const [topTestScore, setTopTestScore] = useState(false);
  const [hasCosigner, setHasCosigner] = useState(false);
  const [hasInternship, setHasInternship] = useState(false);
  const [hasReturnOffer, setHasReturnOffer] = useState(false);

  useEffect(() => {
    updateFinancialData({
      highGPA,
      topTestScore,
      hasCosigner,
      hasInternship,
      hasReturnOffer
    });
  }, [highGPA, topTestScore, hasCosigner, hasInternship, hasReturnOffer]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return '';
    return `$${value.toLocaleString()}`;
  };

  const validateAndSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validations for required fields
    if (data.financial.fundingRequired === null) {
      newErrors.fundingRequired = 'Funding required is required';
    }
    
    if (data.financial.yearOfFirstPayment === null) {
      newErrors.yearOfFirstPayment = 'Year of first payment is required';
    }
    
    if (data.financial.incomeFloor === null) {
      newErrors.incomeFloor = 'Income floor is required';
    }
    
    if (data.financial.maxTermYears === null) {
      newErrors.maxTermYears = 'Max term years is required';
    }
    
    if (data.financial.repaymentCapMultiple === null) {
      newErrors.repaymentCapMultiple = 'Repayment cap multiple is required';
    }
    
    if (!data.financial.educationMode) {
      newErrors.educationMode = 'Education mode is required';
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
        <h2 className="text-2xl font-bold tracking-tight">Your financial details</h2>
        <p className="text-sm text-gray-500">
          This helps us provide accurate loan calculations and income projections
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Funding Required */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 1 ? "visible" : "hidden"}
          variants={questionVariants}
        >
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
                if (value !== null) showNextQuestion();
              }}
              className={`pl-6 ${errors.fundingRequired ? 'border-red-500' : ''}`}
              placeholder="Amount needed for education"
              max={50000}
            />
            <span className="absolute top-3 left-3 text-gray-500">$</span>
          </div>
          <p className="text-xs text-gray-500">Maximum amount: $50,000</p>
          {errors.fundingRequired && <p className="text-sm text-red-500">{errors.fundingRequired}</p>}
        </motion.div>

        {/* Education Mode */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 2 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="educationMode" className="text-sm font-medium text-blue-600">
            Mode of Education
          </Label>
          <Select
            value={data.financial.educationMode || ''}
            onValueChange={(value) => {
              updateFinancialData({ educationMode: value });
              showNextQuestion();
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select mode of education" />
            </SelectTrigger>
            <SelectContent>
              {educationModes.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.educationMode && <p className="text-sm text-red-500">{errors.educationMode}</p>}
        </motion.div>
        
        {/* Graduation Date */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 3 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="graduationDate" className="text-sm font-medium text-blue-600">
            Expected Graduation Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${errors.graduationDate ? 'border-red-500' : ''}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {graduationDate ? format(graduationDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={graduationDate}
                onSelect={(date) => {
                  if (date) {
                    setGraduationDate(date);
                    showNextQuestion();
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.graduationDate && <p className="text-sm text-red-500">{errors.graduationDate}</p>}
        </motion.div>

        {/* Employment Date */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 4 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="employmentDate" className="text-sm font-medium text-blue-600">
            Expected Full-Time Employment Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${errors.employmentDate ? 'border-red-500' : ''}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {employmentDate ? format(employmentDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={employmentDate}
                onSelect={(date) => {
                  if (date) {
                    setEmploymentDate(date);
                    updateFinancialData({ employmentDate: date.toISOString() });
                    showNextQuestion();
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {employmentDate && graduationDate && new Date(employmentDate) > new Date(new Date(graduationDate).setMonth(graduationDate.getMonth() + 4)) && (
            <div className="flex items-center space-x-1 text-amber-600 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>Employment date is more than 4 months after graduation. You will be asked to explain your post-graduation plans.</span>
            </div>
          )}
          {errors.employmentDate && <p className="text-sm text-red-500">{errors.employmentDate}</p>}
        </motion.div>
        
        {/* Year of First Payment */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 5 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="yearOfFirstPayment" className="text-sm font-medium text-blue-600">
            Year of First Payment: {data.financial.yearOfFirstPayment || 1}
          </Label>
          <Slider
            id="yearOfFirstPayment"
            value={data.financial.yearOfFirstPayment !== null ? [data.financial.yearOfFirstPayment] : [1]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => {
              updateFinancialData({ yearOfFirstPayment: value[0] });
              showNextQuestion();
            }}
            className={errors.yearOfFirstPayment ? 'border-red-500 border rounded-lg p-2' : ''}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 year</span>
            <span>5 years</span>
          </div>
          {errors.yearOfFirstPayment && <p className="text-sm text-red-500">{errors.yearOfFirstPayment}</p>}
        </motion.div>
        
        {/* Income Floor */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 6 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="incomeFloor" className="text-sm font-medium text-blue-600">
            Income Floor: {data.financial.incomeFloor ? formatCurrency(data.financial.incomeFloor) : '$0'}
          </Label>
          <Slider
            id="incomeFloor"
            value={data.financial.incomeFloor !== null ? [data.financial.incomeFloor] : [0]}
            min={0}
            max={40000}
            step={1000}
            onValueChange={(value) => {
              updateFinancialData({ incomeFloor: value[0] });
              showNextQuestion();
            }}
            className={errors.incomeFloor ? 'border-red-500 border rounded-lg p-2' : ''}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$40,000</span>
          </div>
          <p className="text-xs text-gray-500">
            Income below this amount is protected from repayment (the repayment rate applies only to income above this minimum)
          </p>
          {errors.incomeFloor && <p className="text-sm text-red-500">{errors.incomeFloor}</p>}
        </motion.div>
        
        {/* Max Term Years */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 7 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="maxTermYears" className="text-sm font-medium text-blue-600">
            Max Term Years: {data.financial.maxTermYears || 0}
          </Label>
          <Slider
            id="maxTermYears"
            value={data.financial.maxTermYears !== null ? [data.financial.maxTermYears] : [10]}
            min={3}
            max={20}
            step={1}
            onValueChange={(value) => {
              updateFinancialData({ maxTermYears: value[0] });
              showNextQuestion();
            }}
            className={errors.maxTermYears ? 'border-red-500 border rounded-lg p-2' : ''}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>3 years</span>
            <span>20 years</span>
          </div>
          {errors.maxTermYears && <p className="text-sm text-red-500">{errors.maxTermYears}</p>}
        </motion.div>
        
        {/* Repayment Cap Multiple */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 8 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="repaymentCapMultiple" className="text-sm font-medium text-blue-600">
            Repayment Cap Multiple: {data.financial.repaymentCapMultiple?.toFixed(1) || '0.0'}x
          </Label>
          <Slider
            id="repaymentCapMultiple"
            value={data.financial.repaymentCapMultiple !== null ? [data.financial.repaymentCapMultiple * 10] : [20]}
            min={15}
            max={25}
            step={1}
            onValueChange={(value) => {
              updateFinancialData({ repaymentCapMultiple: value[0] / 10 });
              showNextQuestion();
            }}
            className={errors.repaymentCapMultiple ? 'border-red-500 border rounded-lg p-2' : ''}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1.5x</span>
            <span>2.5x</span>
          </div>
          {errors.repaymentCapMultiple && <p className="text-sm text-red-500">{errors.repaymentCapMultiple}</p>}
        </motion.div>
        
        {/* Current Income */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 9 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="currentIncome" className="text-sm font-medium text-blue-600">
            Current Annual Income
          </Label>
          <div className="relative">
            <Input
              id="currentIncome"
              type="number"
              value={data.financial.currentIncome || ''}
              onChange={(e) => {
                updateFinancialData({ 
                  currentIncome: e.target.value ? parseInt(e.target.value) : null 
                });
                showNextQuestion();
              }}
              className={`pl-6`}
              placeholder="Your annual income"
            />
            <span className="absolute top-3 left-3 text-gray-500">$</span>
          </div>
        </motion.div>
        
        {/* Household Income */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 10 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="householdIncome" className="text-sm font-medium text-blue-600">
            Annual Household Income
          </Label>
          <div className="relative">
            <Input
              id="householdIncome"
              type="number"
              value={data.financial.householdIncome || ''}
              onChange={(e) => {
                updateFinancialData({ 
                  householdIncome: e.target.value ? parseInt(e.target.value) : null 
                });
                showNextQuestion();
              }}
              className={`pl-6`}
              placeholder="Total household income"
            />
            <span className="absolute top-3 left-3 text-gray-500">$</span>
          </div>
        </motion.div>
        
        {/* Dependents */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 11 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label htmlFor="dependents" className="text-sm font-medium text-blue-600">
            Financial Dependents: {data.financial.dependents || 0}
          </Label>
          <Slider
            id="dependents"
            value={data.financial.dependents !== null ? [data.financial.dependents] : [0]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => {
              updateFinancialData({ dependents: value[0] });
              showNextQuestion();
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>10</span>
          </div>
        </motion.div>
        
        {/* Rate-Reducing Factors */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={visibleQuestions >= 12 ? "visible" : "hidden"}
          variants={questionVariants}
        >
          <Label className="text-sm font-medium text-blue-600">Rate-Reducing Factors</Label>
          <p className="text-xs text-gray-500 mb-3">
            Check any that apply to you. These factors may reduce your repayment rate.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="highGPA" 
                checked={highGPA} 
                onCheckedChange={(checked) => setHighGPA(!!checked)} 
              />
              <Label htmlFor="highGPA" className="text-sm">Cumulative GPA ≥ 3.5/4.0</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="topTestScore" 
                checked={topTestScore} 
                onCheckedChange={(checked) => setTopTestScore(!!checked)} 
              />
              <Label htmlFor="topTestScore" className="text-sm">Top 15% standardized test score</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasCosigner" 
                checked={hasCosigner} 
                onCheckedChange={(checked) => setHasCosigner(!!checked)} 
              />
              <Label htmlFor="hasCosigner" className="text-sm">Will have a cosigner</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasInternship" 
                checked={hasInternship} 
                onCheckedChange={(checked) => setHasInternship(!!checked)} 
              />
              <Label htmlFor="hasInternship" className="text-sm">Have relevant internship of 10+ weeks</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasReturnOffer" 
                checked={hasReturnOffer} 
                onCheckedChange={(checked) => setHasReturnOffer(!!checked)} 
              />
              <Label htmlFor="hasReturnOffer" className="text-sm">Have return offer from internship</Label>
            </div>
          </div>
        </motion.div>
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

export default FinancialStep;


import { useOnboarding } from '@/contexts/OnboardingContext';

const OnboardingProgress = () => {
  const { currentStep } = useOnboarding();
  const steps = ['Demographics', 'Financial', 'Academic'];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className={`text-xs font-medium ${
              idx < currentStep ? 'text-blue-600' : idx === currentStep ? 'text-blue-600 font-bold' : 'text-gray-400'
            }`}
          >
            {step}
            {idx === currentStep && <span className="ml-1">•</span>}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OnboardingProgress;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Check, FileText, Clock, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ApplicationProgressProps {
  applicationData: any;
  documentCount: number;
}

const LoanApplicationProgress: React.FC<ApplicationProgressProps> = ({ 
  applicationData, 
  documentCount 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercentage, setProgressPercentage] = useState(25);

  useEffect(() => {
    // Determine current step based on application data
    if (!applicationData) {
      setCurrentStep(1); // Pre-approval
      setProgressPercentage(25);
    } else if (documentCount === 0) {
      setCurrentStep(2); // Document upload needed
      setProgressPercentage(50);
    } else if (applicationData.status === 'draft') {
      setCurrentStep(3); // Final submission
      setProgressPercentage(75);
    } else {
      setCurrentStep(4); // Status review
      setProgressPercentage(100);
    }
  }, [applicationData, documentCount]);

  const steps = [
    {
      id: 1,
      name: 'Pre-Approval',
      description: 'Loan calculator details',
      icon: FileText,
      path: '/advanced-loan-calculator',
      color: currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'
    },
    {
      id: 2,
      name: 'Document Upload',
      description: 'Identity verification',
      icon: Upload,
      path: '/document-upload',
      color: currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
    },
    {
      id: 3,
      name: 'Final Submission',
      description: 'Review and submit',
      icon: Check,
      path: '/final-submission',
      color: currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
    },
    {
      id: 4,
      name: 'Status Review',
      description: 'Application tracking',
      icon: Clock,
      path: '/loan-status',
      color: currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-4">Application Progress</h2>
      
      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-2 mb-6" />
      
      {/* Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step) => (
          <Link 
            key={step.id} 
            to={step.path}
            className="flex flex-col items-center transition-colors hover:bg-gray-50 p-3 rounded-lg"
          >
            <div className={`${step.color} rounded-full p-2 mb-2 text-white`}>
              <step.icon className="h-5 w-5" />
            </div>
            <p className="font-medium text-center">{step.name}</p>
            <p className="text-xs text-gray-500 text-center">{step.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LoanApplicationProgress;

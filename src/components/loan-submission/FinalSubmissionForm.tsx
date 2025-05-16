
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ApplicationSummary } from '@/components/loan-submission';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserPlan } from '@/hooks/use-user-plan';
import { formatCurrency } from '@/utils/calculatorUtils';

const FinalSubmissionForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { plan } = useUserPlan();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [degreeProgram, setDegreeProgram] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserDocuments();
      fetchInstitutionAndDegree();
    }
  }, [user]);

  const fetchInstitutionAndDegree = async () => {
    try {
      // Fetch or create a default institution if one doesn't exist
      const { data: existingInstitutions, error: institutionError } = await supabase
        .from('institutions')
        .select('*')
        .limit(1);

      if (institutionError) throw institutionError;

      let institutionId;
      
      if (!existingInstitutions || existingInstitutions.length === 0) {
        // Create a default institution
        const { data: newInstitution, error: createError } = await supabase
          .from('institutions')
          .insert({
            name: 'Default Institution',
            type: 'University'
          })
          .select()
          .single();

        if (createError) throw createError;
        institutionId = newInstitution.id;
        setInstitution(newInstitution);
      } else {
        institutionId = existingInstitutions[0].id;
        setInstitution(existingInstitutions[0]);
      }

      // Now check for degree programs
      const { data: existingPrograms, error: programError } = await supabase
        .from('degree_programs')
        .select('*')
        .eq('institution_id', institutionId)
        .limit(1);

      if (programError) throw programError;

      if (!existingPrograms || existingPrograms.length === 0) {
        // Create a default degree program
        const { data: newProgram, error: createProgramError } = await supabase
          .from('degree_programs')
          .insert({
            name: 'Default Degree Program',
            institution_id: institutionId,
            level: 'Bachelor',
            field_of_study: 'General',
            duration: 48 // 4 years
          })
          .select()
          .single();

        if (createProgramError) throw createProgramError;
        setDegreeProgram(newProgram);
      } else {
        setDegreeProgram(existingPrograms[0]);
      }
    } catch (error: any) {
      console.error('Error fetching institution and degree:', error.message);
    }
  };

  const loadUserDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setDocuments(data || []);
      
      // Create application data from plan info
      if (plan) {
        setApplicationData({
          loan_amount: plan.loanAmount || 0,
          interest_rate: 0.0, // Default value, adjust as needed
          term_months: (plan.loanTerm || 10) * 12,
          income_floor: plan.incomeFloor || 0,
          repayment_cap: plan.repaymentCap || 0,
          document_ids: data?.map(doc => doc.id) || []
        });
      }
    } catch (error: any) {
      console.error('Error loading documents:', error.message);
      toast({
        variant: "destructive",
        title: "Failed to load documents",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Please confirm",
        description: "You must confirm that all information is accurate and complete.",
      });
      return;
    }

    if (!applicationData) {
      toast({
        variant: "destructive",
        title: "Missing application data",
        description: "Unable to retrieve your application data. Please try again.",
      });
      return;
    }

    if (!institution || !degreeProgram) {
      toast({
        variant: "destructive",
        title: "Missing institution data",
        description: "Unable to retrieve institution and degree program data. Please try again.",
      });
      return;
    }

    if (documents.length === 0) {
      toast({
        variant: "destructive",
        title: "No documents uploaded",
        description: "Please upload required documents before submitting your application.",
      });
      navigate('/document-upload');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure all required fields are present to match the database schema
      const { data, error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: user?.id,
          loan_amount: applicationData.loan_amount,
          interest_rate: applicationData.interest_rate,
          term_months: applicationData.term_months,
          institution_id: institution.id,
          degree_program_id: degreeProgram.id,
          income_floor: applicationData.income_floor,
          repayment_cap: applicationData.repayment_cap,
          status: 'Submitted'
        })
        .select();

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Check your email for confirmation of your submission.",
      });

      // Navigate to loan status page after successful submission
      setTimeout(() => {
        navigate('/loan-status');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your application data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/document-upload')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Document Upload
          </button>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" />
            Finalize Your Loan Application
          </h1>
          <p className="mt-2 text-gray-600">
            Review your application details and submit for review. You'll receive a confirmation email upon submission.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Application Summary */}
          <div className="md:col-span-2">
            <ApplicationSummary 
              plan={plan} 
              documents={documents} 
              formatCurrency={formatCurrency} 
            />
            
            {/* Add a link to check application status for users who have already submitted */}
            {documents.length > 0 && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-blue-800 mb-2">
                  Already submitted your application? Check your application status:
                </p>
                <Button 
                  onClick={() => navigate('/loan-status')} 
                  variant="outline"
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  View Application Status
                </Button>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <div className="md:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
              <h3 className="text-lg font-semibold">Submit Application</h3>
              
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that all information is accurate and complete
                </label>
              </div>
              
              {!acceptTerms && (
                <p className="text-sm text-red-500">
                  *Required to proceed with submission
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting || !institution || !degreeProgram}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Submit Application
                  </>
                )}
              </Button>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <p>
                    By submitting, you agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Need help?{" "}
                  <a href="/support" className="text-blue-600 hover:underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSubmissionForm;

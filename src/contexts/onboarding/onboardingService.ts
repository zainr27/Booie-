
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OnboardingData } from './types';

export async function saveOnboardingData(data: OnboardingData, userId: string): Promise<void> {
  try {
    const [demographicResult, academicResult, financialResult] = await Promise.all([
      supabase
        .from('user_demographic_data')
        .upsert({
          user_id: userId,
          age: data.demographic.age,
          gender: data.demographic.gender,
          ethnicity: data.demographic.ethnicity,
          zip_code: data.demographic.zipCode,
          first_name: data.demographic.firstName,
          last_name: data.demographic.lastName,
        })
        .select(),
      
      supabase
        .from('user_academic_data')
        .upsert({
          user_id: userId,
          school: data.academic.school,
          degree_program: data.academic.degreeProgram,
          major: data.academic.major,
          graduation_year: data.academic.graduationYear,
          graduation_month: data.academic.graduationMonth,
          study_mode: data.academic.studyMode,
          delivery_mode: data.academic.deliveryMode,
          is_custom_school: data.academic.isCustomSchool,
          is_custom_major: data.academic.isCustomMajor,
        })
        .select(),
      
      supabase
        .from('user_financial_data')
        .upsert({
          user_id: userId,
          funding_required: data.financial.fundingRequired,
          income_floor: data.financial.incomeFloor,
          max_term_years: data.financial.maxTermYears,
          repayment_cap_multiple: data.financial.repaymentCapMultiple,
          education_mode: data.financial.educationMode,
          graduation_date: data.financial.graduationDate,
          employment_date: data.financial.employmentDate,
          high_gpa: data.financial.highGPA,
          top_test_score: data.financial.topTestScore,
          has_cosigner: data.financial.hasCosigner,
          has_internship: data.financial.hasInternship,
          has_return_offer: data.financial.hasReturnOffer,
        })
        .select(),
    ]);
    
    // Check for errors in each result
    if (demographicResult.error) {
      console.error('Error saving demographic data:', demographicResult.error);
      throw demographicResult.error;
    }
    
    if (academicResult.error) {
      console.error('Error saving academic data:', academicResult.error);
      throw academicResult.error;
    }
    
    if (financialResult.error) {
      console.error('Error saving financial data:', financialResult.error);
      throw financialResult.error;
    }
    
    console.log('All onboarding data saved successfully');
    
    toast({
      title: "Profile saved",
      description: "Your profile information has been saved successfully.",
      variant: "default",
    });
    
  } catch (error) {
    console.error('Error in saveOnboardingData:', error);
    toast({
      title: "Error saving profile",
      description: "There was a problem saving your information. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

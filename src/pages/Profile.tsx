
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import PageTransition from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Save } from 'lucide-react';

type UserData = {
  demographic?: {
    id: string;
    age: number | null;
    gender: string | null;
    ethnicity: string | null;
    zip_code: string | null;
  };
  academic?: {
    id: string;
    school: string;
    degree_program: string;
    major: string;
    graduation_year: number | null;
  };
  financial?: {
    id: string;
    current_income: number | null;
    household_income: number | null;
    dependents: number | null;
    funding_required: number | null;
    year_of_first_payment: number | null;
    income_floor: number | null;
    max_term_years: number | null;
    repayment_cap_multiple: number | null;
  };
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  // State for form values
  const [demographic, setDemographic] = useState<UserData['demographic'] | null>(null);
  const [academic, setAcademic] = useState<UserData['academic'] | null>(null);
  const [financial, setFinancial] = useState<UserData['financial'] | null>(null);

  // Fetch user data
  const { data: userData, refetch } = useQuery({
    queryKey: ['profileData'],
    queryFn: async () => {
      try {
        const [demographicResponse, academicResponse, financialResponse] = await Promise.all([
          supabase.from('user_demographic_data').select('*').eq('user_id', user?.id).single(),
          supabase.from('user_academic_data').select('*').eq('user_id', user?.id).single(),
          supabase.from('user_financial_data').select('*').eq('user_id', user?.id).single()
        ]);

        if (demographicResponse.error) throw demographicResponse.error;
        if (academicResponse.error) throw academicResponse.error;
        if (financialResponse.error) throw financialResponse.error;

        return {
          demographic: demographicResponse.data,
          academic: academicResponse.data,
          financial: financialResponse.data
        };
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
        return null;
      }
    },
  });

  // Set form values when data is loaded
  useEffect(() => {
    if (userData) {
      setDemographic(userData.demographic || null);
      setAcademic(userData.academic || null);
      setFinancial(userData.financial || null);
    }
  }, [userData]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const updates = [];
      
      if (demographic) {
        updates.push(
          supabase
            .from('user_demographic_data')
            .update({
              age: demographic.age,
              gender: demographic.gender,
              ethnicity: demographic.ethnicity,
              zip_code: demographic.zip_code
            })
            .eq('id', demographic.id)
        );
      }
      
      if (academic) {
        updates.push(
          supabase
            .from('user_academic_data')
            .update({
              school: academic.school,
              degree_program: academic.degree_program,
              major: academic.major,
              graduation_year: academic.graduation_year
            })
            .eq('id', academic.id)
        );
      }
      
      if (financial) {
        updates.push(
          supabase
            .from('user_financial_data')
            .update({
              current_income: financial.current_income,
              household_income: financial.household_income,
              dependents: financial.dependents,
              funding_required: financial.funding_required,
              year_of_first_payment: financial.year_of_first_payment,
              income_floor: financial.income_floor,
              max_term_years: financial.max_term_years,
              repayment_cap_multiple: financial.repayment_cap_multiple
            })
            .eq('id', financial.id)
        );
      }
      
      const results = await Promise.all(updates);
      
      // Check for errors
      const hasError = results.some(result => result.error);
      
      if (hasError) {
        throw new Error("One or more updates failed");
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      
      // Refresh data
      refetch();
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (!user?.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <PageTransition>
      <Layout>
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <p className="text-muted-foreground">
                Review and update your personal information
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="mt-4 md:mt-0"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user?.email}</CardTitle>
                    <CardDescription>Account created: {new Date(user?.created_at || '').toLocaleDateString()}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={demographic?.age || ''}
                          onChange={(e) => setDemographic(prev => ({ 
                            ...prev!, 
                            age: e.target.value ? Number(e.target.value) : null 
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                          id="gender"
                          value={demographic?.gender || ''}
                          onChange={(e) => setDemographic(prev => ({ 
                            ...prev!, 
                            gender: e.target.value 
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ethnicity">Ethnicity</Label>
                        <Input
                          id="ethnicity"
                          value={demographic?.ethnicity || ''}
                          onChange={(e) => setDemographic(prev => ({ 
                            ...prev!, 
                            ethnicity: e.target.value 
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          value={demographic?.zip_code || ''}
                          onChange={(e) => setDemographic(prev => ({ 
                            ...prev!, 
                            zip_code: e.target.value 
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                    <CardDescription>Update your academic details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="school">School</Label>
                        <Input
                          id="school"
                          value={academic?.school || ''}
                          onChange={(e) => setAcademic(prev => ({ 
                            ...prev!, 
                            school: e.target.value 
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="degreeProgram">Degree Program</Label>
                        <Input
                          id="degreeProgram"
                          value={academic?.degree_program || ''}
                          onChange={(e) => setAcademic(prev => ({ 
                            ...prev!, 
                            degree_program: e.target.value 
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          value={academic?.major || ''}
                          onChange={(e) => setAcademic(prev => ({ 
                            ...prev!, 
                            major: e.target.value 
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          type="number"
                          value={academic?.graduation_year || ''}
                          onChange={(e) => setAcademic(prev => ({ 
                            ...prev!, 
                            graduation_year: e.target.value ? Number(e.target.value) : null 
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financial">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                    <CardDescription>Update your financial details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentIncome">Current Income</Label>
                        <Input
                          id="currentIncome"
                          type="number"
                          value={financial?.current_income || ''}
                          onChange={(e) => setFinancial(prev => ({ 
                            ...prev!, 
                            current_income: e.target.value ? Number(e.target.value) : null 
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="householdIncome">Household Income</Label>
                        <Input
                          id="householdIncome"
                          type="number"
                          value={financial?.household_income || ''}
                          onChange={(e) => setFinancial(prev => ({ 
                            ...prev!, 
                            household_income: e.target.value ? Number(e.target.value) : null 
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dependents">Dependents</Label>
                        <Input
                          id="dependents"
                          type="number"
                          value={financial?.dependents || ''}
                          onChange={(e) => setFinancial(prev => ({ 
                            ...prev!, 
                            dependents: e.target.value ? Number(e.target.value) : null 
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fundingRequired">Funding Required</Label>
                        <Input
                          id="fundingRequired"
                          type="number"
                          value={financial?.funding_required || ''}
                          onChange={(e) => setFinancial(prev => ({ 
                            ...prev!, 
                            funding_required: e.target.value ? Number(e.target.value) : null 
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isUpdating}
                className="min-w-[120px]"
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
};

export default Profile;

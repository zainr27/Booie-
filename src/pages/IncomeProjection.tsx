import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, DollarSign } from 'lucide-react';
import { degreePrograms, schools, calculateIncomeProjection } from '@/utils/incomeUtils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectionChart, AnalysisSummary, ProgramInputs } from '@/components/income-projection';
const IncomeProjection = () => {
  const [selectedDegree, setSelectedDegree] = useState<string>('cs-bs');
  const [selectedSchool, setSelectedSchool] = useState<string>('mit');
  const [projectionData, setProjectionData] = useState<Array<{
    year: number;
    income: number;
  }>>([]);
  const [projectionYears, setProjectionYears] = useState<number>(15);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<Array<{
    year: number;
    income: number;
    comparison: number;
  }>>([]);
  const [comparisonDegree, setComparisonDegree] = useState<string>('business-bs');
  const [comparisonSchool, setComparisonSchool] = useState<string>('berkeley');
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();

  // Calculate income projection when inputs change
  useEffect(() => {
    calculateProjections();
  }, [selectedDegree, selectedSchool, projectionYears, comparisonDegree, comparisonSchool, isComparing]);
  const calculateProjections = () => {
    const incomes = calculateIncomeProjection(selectedDegree, selectedSchool, projectionYears);
    let formattedData;
    if (isComparing) {
      const comparisonIncomes = calculateIncomeProjection(comparisonDegree, comparisonSchool, projectionYears);
      formattedData = incomes.map((income, index) => {
        const comparisonIncome = comparisonIncomes[index];
        return {
          year: index + 1,
          income: income,
          comparison: comparisonIncome
        };
      });
      setComparisonData(formattedData);
    } else {
      formattedData = incomes.map((income, index) => ({
        year: index + 1,
        income: income
      }));
    }
    setProjectionData(formattedData);
  };

  // Log event function (placeholder)
  const logEvent = (eventName: string) => {
    console.log(`Event logged: ${eventName}`);
  };

  // Find currently selected degree and school objects
  const selectedDegreeObj = degreePrograms.find(d => d.id === selectedDegree);
  const selectedSchoolObj = schools.find(s => s.id === selectedSchool);
  const comparisonDegreeObj = degreePrograms.find(d => d.id === comparisonDegree);
  const comparisonSchoolObj = schools.find(s => s.id === comparisonSchool);
  const handleShareResults = () => {
    const shareData = {
      title: 'My Income Projection',
      text: `Check out my ${projectionYears}-year income projection for a ${selectedDegreeObj?.level} in ${selectedDegreeObj?.name} from ${selectedSchoolObj?.name}!`,
      url: window.location.href
    };
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData).then(() => toast({
        title: "Shared successfully",
        description: "Your projection has been shared!"
      })).catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with others to show your projection."
      });
    }
  };
  const handleApplyButtonClick = () => {
    logEvent('cta_apply_booie_plan');
    if (user) {
      navigate('/loan-application');
    } else {
      navigate('/auth');
    }
  };
  return <Layout>
      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Income Projection</h1>
          <p className="text-gray-600">
            Estimate your future earning potential based on your degree program and school.
            This projection uses historical data to provide an annualized income forecast over time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg bg-slate-950">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-booie-600" />
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ProgramInputs selectedDegree={selectedDegree} setSelectedDegree={setSelectedDegree} selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool} projectionYears={projectionYears} setProjectionYears={setProjectionYears} isComparing={isComparing} setIsComparing={setIsComparing} comparisonDegree={comparisonDegree} setComparisonDegree={setComparisonDegree} comparisonSchool={comparisonSchool} setComparisonSchool={setComparisonSchool} selectedDegreeObj={selectedDegreeObj} selectedSchoolObj={selectedSchoolObj} handleApplyButtonClick={handleApplyButtonClick} />
              </CardContent>
            </Card>
          </div>
          
          {/* Projection Chart */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="text-booie-600" />
                  {projectionYears}-Year Income Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ProjectionChart projectionData={isComparing ? comparisonData : projectionData} isComparing={isComparing} selectedDegreeObj={selectedDegreeObj} selectedSchoolObj={selectedSchoolObj} comparisonDegreeObj={comparisonDegreeObj} comparisonSchoolObj={comparisonSchoolObj} handleShareResults={handleShareResults} />
                
                <AnalysisSummary selectedDegreeObj={selectedDegreeObj} selectedSchoolObj={selectedSchoolObj} projectionData={projectionData} isComparing={isComparing} comparisonDegreeObj={comparisonDegreeObj} comparisonSchoolObj={comparisonSchoolObj} comparisonData={comparisonData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>;
};
export default IncomeProjection;
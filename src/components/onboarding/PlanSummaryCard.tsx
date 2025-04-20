
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { format } from "date-fns";

export const PlanSummaryCard = () => {
  const { data } = useOnboarding();
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMMM yyyy");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Your Plan Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-blue-600">Academic Details</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p><span className="font-medium">School:</span> {data.academic.school}</p>
            <p><span className="font-medium">Degree:</span> {data.academic.degreeProgram}</p>
            <p><span className="font-medium">Major:</span> {data.academic.major}</p>
            <p>
              <span className="font-medium">Study Mode:</span>{" "}
              {data.academic.studyMode} - {data.academic.deliveryMode}
            </p>
          </div>
        </div>
        
        {data.financial.graduationDate && (
          <div>
            <h3 className="font-semibold text-sm text-blue-600">Key Dates</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p>
                <span className="font-medium">Expected Graduation:</span>{" "}
                {formatDate(data.financial.graduationDate)}
              </p>
              {data.financial.employmentDate && (
                <p>
                  <span className="font-medium">Expected Employment:</span>{" "}
                  {formatDate(data.financial.employmentDate)}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileSummary from "./ProfileSummary";
import BooiePlanSummary from "./BooiePlanSummary";
import ComplianceSection from "./ComplianceSection";
import FinancialOverview from "./FinancialOverview";
import FooterApply from "./FooterApply";
import { UserDemographicData, UserAcademicData, UserFinancialData } from "@/types/custom";

interface DashboardContentProps {
  userData: {
    demographic?: UserDemographicData | null;
    academic?: UserAcademicData | null;
    financial?: UserFinancialData | null;
  } | null;
  loading: boolean;
}

const DashboardContent = ({ userData, loading }: DashboardContentProps) => {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back{userData?.demographic?.first_name ? `, ${userData?.demographic?.first_name}` : ''}!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileSummary userData={{
                  demographic: userData?.demographic || undefined,
                  academic: userData?.academic || undefined,
                  financial: userData?.financial ? {
                    funding_required: userData.financial.funding_required
                  } : undefined
                }} isLoading={loading} />
              </CardContent>
            </Card>

            <BooiePlanSummary />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <FinancialOverview 
              userData={userData} 
              isLoading={loading} 
            />

            <ComplianceSection />
          </div>
        </div>

        <FooterApply />
      </div>
    </div>
  );
};

export default DashboardContent;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileSummary from "./ProfileSummary";
import BooiePlanSummary from "./BooiePlanSummary";
import ComplianceSection from "./ComplianceSection";
import FinancialOverview from "./FinancialOverview";
import { UserDemographicData, UserAcademicData, UserFinancialData } from "@/types/custom";
import { ArrowUp, CheckCircle, Circle, Clock } from "lucide-react";

interface DashboardContentProps {
  userData: {
    demographic?: UserDemographicData | null;
    academic?: UserAcademicData | null;
    financial?: UserFinancialData | null;
  } | null;
  loading: boolean;
}

// Activity Timeline for dashboard
const ActivityTimeline = () => {
  const activities = [
    { id: 1, title: "Application submitted", date: "2 days ago", status: "complete" },
    { id: 2, title: "Verification in progress", date: "Yesterday", status: "current" },
    { id: 3, title: "Financial review", date: "Upcoming", status: "upcoming" },
    { id: 4, title: "Final approval", date: "Pending", status: "upcoming" }
  ];

  return (
    <Card className="shadow-md overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-background to-muted/40">
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {activities.map((activity, i) => (
            <div key={activity.id} className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {activity.status === 'complete' ? (
                  <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                ) : activity.status === 'current' ? (
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-1 rounded-full">
                    <Circle className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    <Circle className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                {i < activities.length - 1 && (
                  <div className="w-px h-8 bg-border mx-auto my-1"></div>
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, change, icon }: { title: string; value: string; change?: string; icon: React.ReactNode }) => {
  return (
    <Card className="shadow-sm overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className="flex items-center mt-1 text-sm text-green-600 dark:text-green-400">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardContent = ({ userData, loading }: DashboardContentProps) => {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{userData?.demographic?.first_name ? `, ${userData?.demographic?.first_name}` : ''}!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-md overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-2 bg-gradient-to-r from-background to-muted/40">
                <CardTitle className="text-xl">Profile Summary</CardTitle>
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
            
            <ActivityTimeline />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <FinancialOverview 
              userData={userData} 
              isLoading={loading} 
            />

            <ComplianceSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

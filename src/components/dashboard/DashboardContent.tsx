import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserDemographicData, UserFinancialData, UserAcademicData } from '@/types/custom';
import { formatCurrency } from '@/utils/calculatorUtils';
import { CreditCard, User, Book, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LoanStatusCard } from './LoanStatusCard';

interface DashboardContentProps {
  userData: {
    demographic?: UserDemographicData | null;
    academic?: UserAcademicData | null;
    financial?: UserFinancialData | null;
  } | null;
  loading: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ userData, loading }) => {
  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">Failed to load user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { demographic, academic, financial } = userData;

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loan Application Status Card */}
        <LoanStatusCard />

        {/* Profile Information Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {demographic ? (
              <>
                <p className="text-sm text-gray-500">
                  Name: {demographic.first_name} {demographic.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  Age: {demographic.age}
                </p>
                <p className="text-sm text-gray-500">
                  Gender: {demographic.gender}
                </p>
                <Link to="/profile">
                  <Button variant="secondary">Update Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  No profile information available.
                </p>
                <Link to="/profile">
                  <Button>Complete Profile</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Academic Information Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Academic Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {academic ? (
              <>
                <p className="text-sm text-gray-500">
                  School: {academic.school}
                </p>
                <p className="text-sm text-gray-500">
                  Degree: {academic.degree_program}
                </p>
                <p className="text-sm text-gray-500">
                  Major: {academic.major}
                </p>
                {/* Add a button to update academic information */}
                <Link to="/profile">
                  <Button variant="secondary">Update Academic Info</Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  No academic information available.
                </p>
                <Link to="/profile">
                  <Button>Add Academic Info</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Financial Information Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Financial Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {financial ? (
              <>
                <p className="text-sm text-gray-500">
                  Funding Required: {formatCurrency(financial.funding_required || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  Income Floor: {formatCurrency(financial.income_floor || 0)}
                </p>
                <Link to="/profile">
                  <Button variant="secondary">Update Financial Info</Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  No financial information available.
                </p>
                <Link to="/profile">
                  <Button>Add Financial Info</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;

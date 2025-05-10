
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/calculatorUtils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Percent } from "lucide-react";
import { useUserPlan } from "@/hooks/use-user-plan";

interface FinancialOverviewProps {
  userData?: {
    financial?: {
      funding_required: number | null;
      income_floor?: number | null;
      max_term_years?: number | null;
    } | null;
  };
  isLoading: boolean;
}

const FinancialOverview = ({ userData, isLoading }: FinancialOverviewProps) => {
  const { plan } = useUserPlan(true);

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Financial Overview</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 animate-pulse bg-muted rounded-md" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 animate-pulse bg-muted rounded-md" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 animate-pulse bg-muted rounded-md" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 animate-pulse bg-muted rounded-md" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-purple-500 dark:text-purple-400" />
                Funding Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plan?.loanAmount
                  ? formatCurrency(plan.loanAmount)
                  : formatCurrency(userData?.financial?.funding_required || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-purple-500 dark:text-purple-400" />
                Income Floor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plan?.incomeFloor
                  ? formatCurrency(plan.incomeFloor)
                  : formatCurrency(userData?.financial?.income_floor || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Percent className="h-4 w-4 mr-1 text-purple-500 dark:text-purple-400" /> 
                Income Share Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plan?.maxRate
                  ? `${(plan.maxRate / 100).toFixed(2)}%`
                  : '0.0%'}
              </div>
              <div className="text-sm text-muted-foreground">
                of income above floor
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1 text-purple-500 dark:text-purple-400" />
                Max Term
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plan?.loanTerm
                  ? `${plan.loanTerm} years`
                  : `${userData?.financial?.max_term_years || 0} years`}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="mt-6">
        <Link to="/advanced-loan-calculator">
          <Button className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 shadow-lg">
            Explore Booie Plan Options
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FinancialOverview;

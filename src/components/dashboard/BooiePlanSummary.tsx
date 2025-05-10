
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPlan } from "@/hooks/use-user-plan";
import { formatCurrency } from "@/utils/calculatorUtils";
import { BadgeCheck, GraduationCap, ShieldCheck, CirclePercent } from "lucide-react";

const BooiePlanSummary = () => {
  const { plan, isLoading } = useUserPlan();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Booie Plan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="h-16 animate-pulse bg-muted rounded-md" />
          <div className="h-12 animate-pulse bg-muted rounded-md" />
          <div className="h-12 animate-pulse bg-muted rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Booie Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No plan information available yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate origination fee (1%)
  const originationFee = (plan.loanAmount || 0) * 0.01;
  const netAmount = (plan.loanAmount || 0) - originationFee;

  return (
    <Card className="border-booie-500/40">
      <CardHeader className="bg-gradient-to-r from-booie-50 to-blue-50 rounded-t-lg border-b border-booie-100">
        <CardTitle className="text-xl flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-booie-600" /> 
          Your Booie Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center">
              <BadgeCheck className="h-4 w-4 mr-1 text-booie-500" /> Program
            </p>
            <p className="font-medium">{plan.school || "Not specified"}</p>
            <p className="text-sm">{plan.degree || "Not specified"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center">
              <CirclePercent className="h-4 w-4 mr-1 text-booie-500" /> Income Share
            </p>
            <p className="font-medium">{(plan.maxRate || 0) / 100}% of income</p>
            <p className="text-sm">above {formatCurrency(plan.incomeFloor || 0)}/year</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Funding Amount:</span>
            <span className="font-bold">{formatCurrency(plan.loanAmount || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Origination Fee (1%):</span>
            <span>{formatCurrency(originationFee)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Net Disbursement:</span>
            <span className="font-bold">{formatCurrency(netAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Repayment Cap:</span>
            <span className="font-bold">{formatCurrency(plan.repaymentCap || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Maximum Term:</span>
            <span className="font-bold">{plan.loanTerm || 0} years</span>
          </div>
        </div>

        <div className="flex items-center px-4 py-3 bg-green-50 rounded-md border border-green-100">
          <ShieldCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" /> 
          <p className="text-sm text-green-700">
            <span className="font-medium">Income protection:</span> No payments when earning below {formatCurrency(plan.incomeFloor || 0)}/year
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BooiePlanSummary;

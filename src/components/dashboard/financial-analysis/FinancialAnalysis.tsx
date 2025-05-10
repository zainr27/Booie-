
import { useFinancialData } from './useFinancialData';
import IncomeProjectionChart from './IncomeProjectionChart';
import PlanAnalysisChart from './PlanAnalysisChart';
import { ComplianceCard } from '../compliance';

const FinancialAnalysis = () => {
  const { incomeData, loanData, loading } = useFinancialData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Financial Analysis</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <IncomeProjectionChart incomeData={incomeData} loading={loading} />
        <PlanAnalysisChart loanData={loanData} loading={loading} />
      </div>
    </div>
  );
};

export default FinancialAnalysis;

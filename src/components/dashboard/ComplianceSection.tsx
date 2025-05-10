
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialAnalysis from './financial-analysis/FinancialAnalysis';
import RegulatoryCompliance from './compliance/RegulatoryCompliance';

const ComplianceSection = () => {
  return (
    <Tabs defaultValue="financial" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
        <TabsTrigger value="regulatory">Regulatory Compliance</TabsTrigger>
      </TabsList>
      <TabsContent value="financial">
        <FinancialAnalysis />
      </TabsContent>
      <TabsContent value="regulatory">
        <RegulatoryCompliance />
      </TabsContent>
    </Tabs>
  );
};

export default ComplianceSection;

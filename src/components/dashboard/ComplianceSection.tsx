
import { RegulatoryPrinciples } from "../regulatory/RegulatoryPrinciples";
import { RegulatoryRequirements } from "../regulatory/RegulatoryRequirements";

const ComplianceSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Compliance & Regulatory</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <RegulatoryPrinciples />
        <RegulatoryRequirements />
      </div>
    </div>
  );
};

export default ComplianceSection;

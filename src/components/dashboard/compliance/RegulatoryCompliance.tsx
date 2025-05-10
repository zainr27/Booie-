
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Check } from "lucide-react";

const RegulatoryCompliance = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Regulatory Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Shield className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="text-lg font-medium">CFPB Compliant</h3>
            <p className="text-muted-foreground text-sm">Your plan meets Consumer Financial Protection Bureau standards</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Clear disclosures</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">No prepayment penalties</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Fair collection practices</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryCompliance;

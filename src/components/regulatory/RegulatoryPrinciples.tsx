
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RegulatoryPrinciples = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center">
          Regulatory Framework
          <HoverCard>
            <HoverCardTrigger asChild>
              <AlertCircle className="h-4 w-4 ml-2 text-blue-500 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm">
                These principles guide our platform to ensure compliance with all relevant financial regulations
                and to protect your data and privacy.
              </p>
            </HoverCardContent>
          </HoverCard>
        </CardTitle>
        <CardDescription>
          Backend architecture principles and regulatory compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-base mb-2">Backend Architecture Principles</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Quality</span> that guarantees reliability of both externally sourced and calculated data
              </li>
              <li>
                <span className="font-medium">Security</span> that minimizes threat of unauthorized access to personal and financial data
              </li>
              <li>
                <span className="font-medium">Governance</span> that ensures compliance with US regulatory authorities and passes continued diligence from partner institutions
              </li>
              <li>
                <span className="font-medium">Modular architecture</span> that simplifies data access and analysis, facilitates collaboration between developers, and enables future business scale
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              All structures, data sources, and algorithms are sufficiently and clearly documented for future developers.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

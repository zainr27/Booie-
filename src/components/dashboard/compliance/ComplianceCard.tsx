
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ComplianceCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const ComplianceCard = ({ title, description, children }: ComplianceCardProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-2">
        {children}
      </CardContent>
    </Card>
  );
};

export default ComplianceCard;

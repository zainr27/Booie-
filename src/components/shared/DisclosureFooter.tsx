
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface DisclosureFooterProps {
  className?: string;
}

const DisclosureFooter: React.FC<DisclosureFooterProps> = ({ className }) => {
  return (
    <Card className={`bg-black text-white ${className || ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm">
              <strong className="text-primary">Disclosure:</strong> Income share agreements, such as Booie plans, are considered student loans with payment structures that differ from traditional fixed-rate loans. We encourage borrowers to carefully review all terms and conditions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisclosureFooter;

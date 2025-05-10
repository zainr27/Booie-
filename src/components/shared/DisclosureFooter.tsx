
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DisclosureFooter = () => {
  return (
    <Card className="mt-8 bg-gray-50">
      <CardContent className="pt-6">
        <p className="text-sm text-gray-600">
          <strong>Disclosure:</strong> Income share agreements, such as Booie plans, are considered student loans with payment structures that differ from traditional fixed-rate loans.
        </p>
      </CardContent>
    </Card>
  );
};

export default DisclosureFooter;

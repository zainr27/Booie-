
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DisclosureFooter = () => {
  return (
    <Card className="mt-8 bg-gradient-to-r from-purple-700 to-purple-500 shadow-lg">
      <CardContent className="pt-6 text-white">
        <p className="text-sm">
          <strong>Disclosure:</strong> Income share agreements, such as Booie plans, are considered student loans with payment structures that differ from traditional fixed-rate loans.
        </p>
      </CardContent>
    </Card>
  );
};

export default DisclosureFooter;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DisclosureFooter = () => {
  return (
    <Card className="bg-gray-50">
      <CardContent className="pt-6">
        <h3 className="text-sm font-semibold mb-2">Legal / Disclosure</h3>
        <div className="text-xs text-gray-600 space-y-2">
          <p>
            <strong>Federal Loan vs. Private Loan Benefits:</strong> Some federal student loans include unique benefits that borrowers may lose when refinancing. 
            Carefully review federal benefits—especially if you're in public service, the military, or pursuing forgiveness / income-driven repayment plans. 
            More info at <a href="https://studentaid.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">studentaid.gov</a>.
          </p>
          <p>
            We encourage you to review all of your options—particularly federal loans—before committing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisclosureFooter;

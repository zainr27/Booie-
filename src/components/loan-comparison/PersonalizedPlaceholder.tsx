
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PersonalizedPlaceholder = () => {
  return (
    <Card className="opacity-30" data-testid="personalized-placeholder">
      <CardContent className="p-10 text-center">
        <h3 className="text-xl font-bold mb-4">Build your plan to unlock personalized rates</h3>
        <p className="mb-6 text-gray-600">
          Complete your Booie plan to see how your specific situation impacts your rate.
        </p>
        <Link to="/builder">
          <Button className="bg-booie-600 hover:bg-booie-700">
            Go to Plan Builder
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PersonalizedPlaceholder;

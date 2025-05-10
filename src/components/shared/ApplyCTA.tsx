
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ApplyCTA = () => {
  return (
    <div className="mt-10 flex justify-center">
      <Link to="/apply" className="block md:w-1/2 w-full">
        <Button className="w-full bg-booie-600 hover:bg-booie-700 text-white py-6 flex items-center justify-center gap-2 text-lg font-medium" size="lg">
          Apply for a Booie Plan
          <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  );
};

export default ApplyCTA;

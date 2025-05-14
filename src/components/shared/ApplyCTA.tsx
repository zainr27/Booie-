
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ApplyCTA = () => {
  return (
    <div className="mt-10 flex justify-center">
      <Link to="/apply" className="block md:w-1/2 w-full">
        <Button className="w-full py-6 text-lg font-medium bg-green-600 hover:bg-green-700 text-white">
          Apply for your Booie Plan
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};

export default ApplyCTA;

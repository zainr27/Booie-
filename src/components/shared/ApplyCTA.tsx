
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ApplyCTA = () => {
  return (
    <div className="mt-10 flex justify-center">
      <Link to="/apply">
        <Button className="w-full bg-booie-600 hover:bg-booie-700 text-white py-3 flex items-center justify-center gap-2 text-lg font-medium">
          Apply for a Booie Plan
          <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  );
};

export default ApplyCTA;


import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-500 mb-4">
        Income share agreements, such as Booie plans, are considered student loans.
      </p>
      <div>
        <a href="/support" className="text-blue-600 hover:underline flex items-center">
          <span>Contact Support</span>
        </a>
      </div>
    </div>
  );
};

export default DashboardFooter;


import React from 'react';
import { formatCurrency } from '@/utils/calculatorUtils';

type ApplicationDetailsProps = {
  application: any;
  documentCount: number;
};

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application, documentCount }) => {
  return (
    <div className="bg-gray-50 border rounded-lg p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Application Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500">Application ID</p>
            <p className="text-gray-700">{application.id.substring(0, 8)}...</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500">Submission Date</p>
            <p className="text-gray-700">
              {new Date(application.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500">Funding Amount</p>
            <p className="text-gray-700">{formatCurrency(application.loan_amount)}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500">Documents Uploaded</p>
            <p className="text-gray-700">{documentCount} document{documentCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

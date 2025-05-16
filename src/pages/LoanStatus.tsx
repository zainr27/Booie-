
import React from 'react';
import Layout from '@/components/layout/Layout';
import { LoanStatusContent } from '@/components/loan-status';

const LoanStatus: React.FC = () => {
  return (
    <Layout hideApplyCTA={true} hideDisclosure={false}>
      <LoanStatusContent />
    </Layout>
  );
};

export default LoanStatus;

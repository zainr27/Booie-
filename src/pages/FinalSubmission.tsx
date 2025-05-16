
import React from 'react';
import Layout from '@/components/layout/Layout';
import { FinalSubmissionForm } from '@/components/loan-submission';

const FinalSubmission: React.FC = () => {
  return (
    <Layout hideApplyCTA={true} hideDisclosure={false}>
      <FinalSubmissionForm />
    </Layout>
  );
};

export default FinalSubmission;

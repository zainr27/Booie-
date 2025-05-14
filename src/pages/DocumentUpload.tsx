
import React from 'react';
import Layout from '@/components/layout/Layout';
import { DocumentUpload as DocumentUploadComponent } from '@/components/shared';

const DocumentUpload: React.FC = () => {
  return (
    <Layout hideApplyCTA={true} hideDisclosure={false}>
      <DocumentUploadComponent />
    </Layout>
  );
};

export default DocumentUpload;

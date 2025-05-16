
import React, { useState } from 'react';
import ApplicationTable from './ApplicationTable';
import ApplicationModal from './ApplicationModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Application, ApplicationDocument, StatusHistoryItem } from './types/ApplicationTypes';

const AdminContent = () => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusUpdated = () => {
    // Will force the table to refresh
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="applications" className="w-full">
        <TabsList>
          <TabsTrigger value="applications">Loan Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="pt-6">
          <ApplicationTable onViewApplication={handleViewApplication} />
        </TabsContent>
        
        <TabsContent value="documents" className="pt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-500">Document management view coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>

      {selectedApplication && (
        <ApplicationModal
          isOpen={isModalOpen}
          application={selectedApplication}
          onClose={handleCloseModal}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

export default AdminContent;

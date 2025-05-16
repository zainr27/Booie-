
import React from 'react';
import AdminHeader from './AdminHeader';
import AdminContent from './AdminContent';
import { DisclosureFooter } from '@/components/shared';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      <div className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-2">Booie Admin Panel</h1>
        <p className="text-gray-600 mb-6">Review and manage loan applications and documents.</p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <p className="text-amber-800 font-medium">
            Admin access is restricted to authorized personnel.
          </p>
        </div>
        
        <AdminContent />
      </div>
      
      <div className="container mx-auto px-4 py-6 mt-auto">
        <DisclosureFooter />
        <div className="mt-4 text-center text-sm text-gray-500">
          <a href="/support" className="text-blue-600 hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

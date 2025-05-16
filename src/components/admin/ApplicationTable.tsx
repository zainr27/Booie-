
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody } from '@/components/ui/table';
import { useApplications } from './hooks/useApplications';
import { Application } from './types/ApplicationTypes';
import ApplicationTableHeader from './ApplicationTableHeader';
import ApplicationTableRow from './ApplicationTableRow';
import ApplicationSearch from './ApplicationSearch';
import TablePagination from './TablePagination';

interface ApplicationTableProps {
  onViewApplication: (application: Application) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ onViewApplication }) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const PAGE_SIZE = 10;

  const { applications, loading, error, totalPages } = useApplications({
    page,
    sortBy,
    sortOrder,
    searchQuery,
    pageSize: PAGE_SIZE
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const columns = [
    { key: 'id', label: 'Application ID', sortable: true },
    { key: 'email', label: 'User Email', sortable: false },
    { key: 'degree_program', label: 'School/Program', sortable: false },
    { key: 'loan_amount', label: 'Funding Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'created_at', label: 'Submission Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-red-500">{error}</div>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => {
            setPage(1);
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <h2 className="text-lg font-semibold">Loan Applications</h2>
          <ApplicationSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <ApplicationTableHeader 
            columns={columns} 
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <TableBody>
            {loading ? (
              <tr>
                <td colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="h-24 text-center">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <ApplicationTableRow
                  key={application.id}
                  application={application}
                  onViewApplication={onViewApplication}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination 
        currentPage={page}
        totalPages={totalPages}
        itemCount={applications.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ApplicationTable;

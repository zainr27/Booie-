
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Application } from './AdminContent';
import StatusBadge from '../loan-status/StatusBadge';
import { formatCurrency } from '@/utils/financeUtils';

interface ApplicationTableProps {
  onViewApplication: (application: Application) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ onViewApplication }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const PAGE_SIZE = 10;

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate pagination
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      // Start building query
      let query = supabase
        .from('loan_applications')
        .select(`
          *,
          user:user_id(email),
          degree_program:degree_program_id(
            name,
            institution:institution_id(name)
          )
        `, { count: 'exact' });
      
      // Add search if present
      if (searchQuery) {
        // Add search by user email using joins
        query = query.or(`user.email.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`);
      }
      
      // Add sorting and pagination
      const { data, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
      
      if (error) throw error;
      
      setApplications(data || []);
      setTotalPages(count ? Math.ceil(count / PAGE_SIZE) : 1);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, sortBy, sortOrder, searchQuery]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-red-500">{error}</div>
        <Button variant="outline" className="mt-4" onClick={fetchApplications}>
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
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Application ID {getSortIcon('id')}
              </TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>School/Program</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('loan_amount')}
              >
                Funding Amount {getSortIcon('loan_amount')}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                Submission Date {getSortIcon('created_at')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{application.user?.email || 'Unknown'}</TableCell>
                  <TableCell>
                    {application.degree_program?.institution?.name ? (
                      <>
                        {application.degree_program.institution.name}<br />
                        <span className="text-xs text-gray-500">
                          {application.degree_program.name}
                        </span>
                      </>
                    ) : (
                      'Unknown'
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(application.loan_amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell>{formatDate(application.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => onViewApplication(application)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {applications.length > 0 ? (
            <>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, (page - 1) * PAGE_SIZE + applications.length)} of {totalPages * PAGE_SIZE} applications</>
          ) : (
            'No applications found'
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTable;

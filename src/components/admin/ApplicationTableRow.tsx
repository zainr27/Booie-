
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Application } from './types/ApplicationTypes';
import StatusBadge from '../loan-status/StatusBadge';
import { formatCurrency } from '@/utils/financeUtils';

interface ApplicationTableRowProps {
  application: Application;
  onViewApplication: (application: Application) => void;
}

const ApplicationTableRow: React.FC<ApplicationTableRowProps> = ({ 
  application, 
  onViewApplication 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TableRow>
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
  );
};

export default ApplicationTableRow;

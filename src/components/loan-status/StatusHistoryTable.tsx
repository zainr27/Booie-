
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

type StatusHistoryItem = {
  id: string;
  status: string;
  notes: string;
  created_at: string;
};

type StatusHistoryTableProps = {
  history: StatusHistoryItem[];
};

const StatusHistoryTable: React.FC<StatusHistoryTableProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No status updates yet</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Status</TableHead>
            <TableHead className="w-1/3">Date</TableHead>
            <TableHead className="w-1/3">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.status}</TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell>{item.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatusHistoryTable;

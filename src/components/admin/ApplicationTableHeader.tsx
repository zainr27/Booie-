
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ColumnHeader {
  key: string;
  label: string;
  sortable: boolean;
}

interface ApplicationTableHeaderProps {
  columns: ColumnHeader[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const ApplicationTableHeader: React.FC<ApplicationTableHeaderProps> = ({
  columns,
  sortBy,
  sortOrder,
  onSort
}) => {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <TableHeader>
      <TableRow>
        {columns.map(column => (
          <TableHead
            key={column.key}
            className={column.sortable ? "cursor-pointer" : ""}
            onClick={column.sortable ? () => onSort(column.key) : undefined}
          >
            {column.label} {getSortIcon(column.key)}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default ApplicationTableHeader;

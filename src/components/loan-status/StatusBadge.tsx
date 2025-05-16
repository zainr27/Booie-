
import React from 'react';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Submitted':
        return 'bg-yellow-500 text-white';
      case 'Under Review':
        return 'bg-blue-500 text-white';
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span 
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium', 
        getStatusStyles(),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

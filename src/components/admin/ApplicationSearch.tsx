
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ApplicationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ApplicationSearch: React.FC<ApplicationSearchProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
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
  );
};

export default ApplicationSearch;

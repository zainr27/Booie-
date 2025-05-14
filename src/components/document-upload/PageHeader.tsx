
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description: string;
  backPath: string;
  backLabel: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  backPath, 
  backLabel 
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {backLabel}
      </button>
      <h1 className="text-2xl md:text-3xl font-bold flex items-center">
        <FileText className="mr-3 h-8 w-8 text-primary" />
        {title}
      </h1>
      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;

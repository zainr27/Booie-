
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, ArrowRight } from 'lucide-react';

interface RecentActivityProps {
  statusHistory: any[];
  documents: any[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ statusHistory, documents }) => {
  // Combine and sort status updates and document uploads
  const allActivities = [
    ...statusHistory.map(item => ({
      type: 'status',
      date: new Date(item.created_at),
      title: `Status changed to ${item.status}`,
      details: item.notes,
      icon: Clock
    })),
    ...documents.map(doc => ({
      type: 'document',
      date: new Date(doc.uploaded_at),
      title: `Document uploaded`,
      details: doc.file_path.split('/').pop() || 'Document',
      icon: FileText
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5); // Limit to 5 most recent items

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {allActivities.length > 0 ? (
          <div className="border-l border-gray-200 pl-4 space-y-6">
            {allActivities.map((activity, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-6 mt-1">
                  <div className="h-3 w-3 rounded-full bg-blue-600 border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(activity.date, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No recent activity to display
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/loan-status">
            View All Activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;

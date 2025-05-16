
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '../types/ApplicationTypes';

interface UseApplicationsProps {
  page: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  pageSize: number;
}

export const useApplications = ({
  page,
  sortBy,
  sortOrder,
  searchQuery,
  pageSize
}: UseApplicationsProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        // Calculate pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        // Start building query
        let query = supabase
          .from('loan_applications')
          .select(`
            *,
            degree_program:degree_program_id(
              name,
              institution:institution_id(name)
            )
          `, { count: 'exact' });
        
        // Add search if present
        if (searchQuery) {
          // Just search by ID since we can't directly search by email
          query = query.ilike('id', `%${searchQuery}%`);
        }
        
        // Add sorting and pagination
        const { data, error, count } = await query
          .order(sortBy, { ascending: sortOrder === 'asc' })
          .range(from, to);
        
        if (error) throw error;
        
        // Transform the data to ensure it matches the Application type
        const transformedData: Application[] = [];
        
        // Process each loan application
        for (const item of data || []) {
          // For each application, fetch the user email separately
          let userEmail = 'Unknown';
          if (item.user_id) {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', item.user_id)
              .single();
              
            if (!userError && userData) {
              userEmail = userData.email || 'Unknown';
            }
          }
          
          // Create the application object with all required fields
          transformedData.push({
            id: item.id,
            user_id: item.user_id,
            loan_amount: item.loan_amount,
            status: item.status,
            created_at: item.created_at,
            user: { email: userEmail },
            degree_program: item.degree_program
              ? {
                  name: item.degree_program.name || 'Unknown',
                  institution: item.degree_program.institution
                    ? { name: item.degree_program.institution.name }
                    : { name: 'Unknown' }
                }
              : { name: 'Unknown', institution: { name: 'Unknown' } }
          });
        }
        
        setApplications(transformedData);
        setTotalPages(count ? Math.ceil(count / pageSize) : 1);
      } catch (error: any) {
        console.error('Error fetching applications:', error);
        setError(error.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [page, sortBy, sortOrder, searchQuery, pageSize]);

  return { applications, loading, error, totalPages };
};

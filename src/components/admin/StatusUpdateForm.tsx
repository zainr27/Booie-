
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Application } from './AdminContent';
import StatusBadge from '../loan-status/StatusBadge';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface StatusUpdateFormProps {
  application: Application;
  onStatusUpdated: () => void;
}

const statusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters'),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({ application, onStatusUpdated }) => {
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formValues, setFormValues] = useState<StatusFormValues | null>(null);
  
  const statusOptions = [
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: application.status,
      notes: ''
    }
  });
  
  const handleSubmit = (values: StatusFormValues) => {
    setFormValues(values);
    setShowConfirmDialog(true);
  };
  
  const processStatusUpdate = async () => {
    if (!formValues) return;
    
    setSubmitting(true);
    
    try {
      // 1. Update application status
      const { error: updateError } = await supabase
        .from('loan_applications')
        .update({ status: formValues.status })
        .eq('id', application.id);
        
      if (updateError) throw updateError;
      
      // 2. Add status history entry
      const { error: historyError } = await supabase
        .from('loan_status_history')
        .insert({
          application_id: application.id,
          status: formValues.status,
          notes: formValues.notes
        });
        
      if (historyError) throw historyError;
      
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully.",
      });
      
      // Reset the form
      form.reset();
      
      // Notify parent component
      onStatusUpdated();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the application status.",
      });
    } finally {
      setSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Status</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={option.value} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter notes about this status update (will be visible to the applicant)"
                  {...field}
                  rows={4}
                  disabled={submitting}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">
                {form.watch("notes").length}/1000 characters
              </p>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={submitting || !form.formState.isDirty} 
          className="w-full"
        >
          {submitting ? "Updating Status..." : "Update Status"}
        </Button>
      </form>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the application status to{" "}
              <span className="font-semibold">{formValues?.status}</span>?
              {formValues?.status === "Approved" || formValues?.status === "Rejected" ? (
                <p className="mt-2 text-amber-600">
                  This is a final decision status and will notify the applicant.
                </p>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={processStatusUpdate}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
};

export default StatusUpdateForm;

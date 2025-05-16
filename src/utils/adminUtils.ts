
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Make a request to the admin-tools Edge Function to manage admin users
 * @param action The action to perform: 'make-admin', 'remove-admin', 'check-admin'
 * @param email The email of the user to manage
 * @returns Promise with the result of the operation
 */
export const manageAdmin = async (action: 'make-admin' | 'remove-admin' | 'check-admin', email: string) => {
  try {
    // Get the current user's token for authorization
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("You must be logged in to perform this action");
    }
    
    const response = await fetch(
      "https://sgkdegvakeapaidifbnt.supabase.co/functions/v1/admin-tools",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action,
          email
        })
      }
    );
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Failed to perform admin operation");
    }
    
    return result;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Admin Operation Failed",
      description: error.message
    });
    throw error;
  }
};

/**
 * Make a user an admin
 * @param email The email of the user to make an admin
 */
export const makeUserAdmin = async (email: string) => {
  const result = await manageAdmin('make-admin', email);
  
  toast({
    title: "Admin Operation Successful",
    description: result.message || `User ${email} is now an admin`
  });
  
  return result;
};

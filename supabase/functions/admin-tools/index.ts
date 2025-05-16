
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase client init with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { action, email } = await req.json();

    if (!action || !email) {
      throw new Error("Missing required parameters: action and email");
    }

    // Only allow specific actions
    if (!["make-admin", "remove-admin", "check-admin"].includes(action)) {
      throw new Error("Invalid action");
    }

    // Fetch user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin
      .listUsers();

    if (userError) throw userError;
    
    const user = userData.users.find((u) => u.email === email);
    
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    let result;
    
    if (action === "make-admin") {
      // Check if user is already an admin
      const { data: existingAdmin } = await supabaseAdmin
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingAdmin) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `User ${email} is already an admin` 
          }),
          { 
            status: 200, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }

      // Add user to admin_users table
      const { error: insertError } = await supabaseAdmin
        .from("admin_users")
        .insert({ user_id: user.id });

      if (insertError) throw insertError;

      result = { 
        success: true, 
        message: `User ${email} has been made an admin` 
      };
    } 
    else if (action === "remove-admin") {
      const { error: deleteError } = await supabaseAdmin
        .from("admin_users")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      result = { 
        success: true, 
        message: `User ${email} admin privileges revoked` 
      };
    } 
    else if (action === "check-admin") {
      const { data: adminData } = await supabaseAdmin
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      result = { 
        success: true, 
        isAdmin: !!adminData,
        message: adminData 
          ? `User ${email} is an admin` 
          : `User ${email} is not an admin` 
      };
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});

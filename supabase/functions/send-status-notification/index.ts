
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase client init with service role key for accessing auth.users
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    
    if (!record || !record.application_id) {
      throw new Error("Invalid record data");
    }

    // Get application data to find the user_id
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from("loan_applications")
      .select("user_id, loan_amount, status")
      .eq("id", record.application_id)
      .single();

    if (applicationError || !applicationData) {
      throw new Error(`Failed to fetch application: ${applicationError?.message || "Not found"}`);
    }

    // Get user email from auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin
      .getUserById(applicationData.user_id);

    if (userError || !userData || !userData.user.email) {
      throw new Error(`Failed to fetch user: ${userError?.message || "No email found"}`);
    }

    // Format application ID for display (first 8 chars)
    const displayAppId = record.application_id.substring(0, 8);

    // Format currency for loan amount
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(applicationData.loan_amount);

    // Prepare email content based on status
    const statusColors = {
      "Submitted": "#EAB308", // yellow
      "Under Review": "#2563EB", // blue
      "Approved": "#22C55E", // green
      "Rejected": "#EF4444", // red
      "default": "#6B7280", // gray
    };

    const statusColor = statusColors[record.status as keyof typeof statusColors] || statusColors.default;
    const statusInfo = getStatusInfo(record.status);

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booie Loan Application Update</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              font-weight: bold;
              font-size: 24px;
              margin-bottom: 20px;
              color: #111827;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 9999px;
              font-weight: 500;
              font-size: 14px;
              color: white;
              background-color: ${statusColor};
            }
            .message {
              margin: 20px 0;
            }
            .details {
              background-color: #F9FAFB;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 20px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .detail-label {
              color: #6B7280;
              font-weight: 500;
            }
            .notes {
              background-color: #F3F4F6;
              border-left: 4px solid ${statusColor};
              padding: 12px;
              margin: 20px 0;
              font-style: italic;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 10px 18px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 500;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              font-size: 12px;
              color: #6B7280;
            }
          </style>
        </head>
        <body>
          <div class="header">Booie Loan Application Update</div>
          
          <div class="message">
            Your loan application status has been updated to <span class="status-badge">${record.status}</span>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Application ID:</span>
              <span>${displayAppId}...</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Loan Amount:</span>
              <span>${formattedAmount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Updated On:</span>
              <span>${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          ${record.notes ? `
          <div class="notes">
            ${record.notes}
          </div>
          ` : ''}
          
          <div>
            ${statusInfo}
          </div>
          
          <a href="https://lovable-booie.vercel.app/loan-status" class="button">
            View Application Status
          </a>
          
          <div class="footer">
            <p>Income share agreements, such as Booie plans, are considered student loans.</p>
            <p>If you did not apply for this loan, please contact our support team immediately.</p>
          </div>
        </body>
      </html>
    `;

    // Create plain text version for fallback
    const plainTextContent = `
      Booie Loan Application Update
      
      Your loan application status has been updated to: ${record.status}
      
      Application ID: ${displayAppId}...
      Loan Amount: ${formattedAmount}
      Updated On: ${new Date().toLocaleDateString()}
      
      ${record.notes ? `Notes: ${record.notes}\n\n` : ''}
      
      ${statusInfo.replace(/<[^>]*>/g, '')}
      
      To view your application status, visit: https://lovable-booie.vercel.app/loan-status
      
      Income share agreements, such as Booie plans, are considered student loans.
      If you did not apply for this loan, please contact our support team immediately.
    `;

    // Send email via Resend
    const { data: emailData, error: sendError } = await resend.emails.send({
      from: "Booie <notifications@resend.dev>",
      to: [userData.user.email],
      subject: `Booie Loan Application Status Update: ${record.status}`,
      html: htmlContent,
      text: plainTextContent,
    });

    if (sendError) {
      throw new Error(`Failed to send email: ${sendError.message}`);
    }

    // Log success and return response
    console.log(`Status notification email sent to ${userData.user.email}`);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Status notification email sent successfully",
        emailId: emailData?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    // Log error and return error response
    console.error("Error sending status notification:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send status notification email",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

// Helper function to get status-specific information
function getStatusInfo(status: string): string {
  switch(status) {
    case "Submitted":
      return "<p>Thank you for submitting your loan application. Our team will review your application and documents shortly.</p>";
    case "Under Review":
      return "<p>Your application is currently under review by our team. We are evaluating your documents and may reach out if additional information is needed.</p>";
    case "Approved":
      return "<p>Congratulations! Your loan application has been approved. Please check your dashboard for next steps to complete the process.</p>";
    case "Rejected":
      return "<p>Unfortunately, we are unable to approve your loan application at this time. Please check the notes for specific reasons and feel free to contact our support team for more information.</p>";
    default:
      return "<p>Your application status has been updated. Please check your dashboard for more information.</p>";
  }
}

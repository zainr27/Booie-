
// This file provides example code for testing the send-status-notification function
// You can use this as a reference to create a test function if needed

/*
Example test payload:

{
  "record": {
    "id": "some-uuid",
    "application_id": "real-application-id-from-db",
    "status": "Under Review",
    "notes": "Currently reviewing your financial documents. We'll reach out if we need additional information."
  }
}
*/

/*
To create a separate test function, you could do:

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Forward the request to the actual notification function
  // This allows you to test without database triggers
  return await fetch(
    "https://sgkdegvakeapaidifbnt.supabase.co/functions/v1/send-status-notification",
    {
      method: "POST",
      headers: req.headers,
      body: req.body
    }
  );
});
*/

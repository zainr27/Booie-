
// This file shows how to use the admin-tools function

/* 
Example usage:

1. To make a user an admin:
   
   fetch("https://sgkdegvakeapaidifbnt.supabase.co/functions/v1/admin-tools", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": "Bearer YOUR_API_KEY"
     },
     body: JSON.stringify({
       action: "make-admin",
       email: "user@example.com"
     })
   })
   .then(response => response.json())
   .then(data => console.log(data));

2. To check if a user is an admin:

   fetch("https://sgkdegvakeapaidifbnt.supabase.co/functions/v1/admin-tools", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": "Bearer YOUR_API_KEY"
     },
     body: JSON.stringify({
       action: "check-admin",
       email: "user@example.com"
     })
   })
   .then(response => response.json())
   .then(data => console.log(data));

3. To remove admin privileges:

   fetch("https://sgkdegvakeapaidifbnt.supabase.co/functions/v1/admin-tools", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": "Bearer YOUR_API_KEY"
     },
     body: JSON.stringify({
       action: "remove-admin",
       email: "user@example.com"
     })
   })
   .then(response => response.json())
   .then(data => console.log(data));
*/

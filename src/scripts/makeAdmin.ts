
import { makeUserAdmin } from "../utils/adminUtils";

// This script is for demonstration. In a real situation,
// you'll want to use the AdminTools component to make a user an admin.
async function makeAdmin() {
  try {
    await makeUserAdmin("zrahman9668@gmail.com");
    console.log("User zrahman9668@gmail.com is now an admin");
  } catch (error) {
    console.error("Error making user admin:", error);
  }
}

// This won't run automatically, it's just a reference
// for how to call the function programmatically
// makeAdmin();

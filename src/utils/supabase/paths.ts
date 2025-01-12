// PROTECTED ROUTES
// Description: Routes that require user to be authenticated before visiting.
// Note: Add more strings/paths as needed
export const protectedRoutes = new Set(["/dashboard", "/reset-password"]);

// AUTH ROUTES
// Description: Routes that user can only visit if they are not authenticated.
// Note: Add more strings/paths as needed
export const authRoutes = new Set([
  "/", // login route
  "/signup",
  "/forgot-password",
]);

// PROTECTED ROUTES
// Description: Routes that require user to be authenticated before visiting.
// Note: Add more strings/paths as needed
export const protectedRoutes = new Set([
  "/dashboard", // users will be redirected here if they're trying visit any authRoutes after authentication
  "/reset-password", // later, nest this in settings/account page
  "/boards",
  "/todos",
  "/calendar",
  "/pomodoro",
  "/roadmaps",
  "/account",
  "/settings",
]);

// AUTH ROUTES
// Description: Routes that user can only visit if they are not authenticated.
// Note: Add more strings/paths as needed
export const authRoutes = new Set([
  "/", // login route
  "/signup",
  "/forgot-password",
]);

"use server";

import { createClient } from "@/config/supabase/server";
import { AuthError } from "@supabase/supabase-js";

/**
 * authenticateAndResetPassword - Verifies the user's current password, updates it to a new password,
 * and revokes all other active sessions, requiring the user to log in again.
 *
 * @param email - The user's email address.
 * @param currentPassword - The current password for authentication.
 * @param newPassword - The new password to set.
 *
 * @returns {Promise<AuthError | string>} - A success message or an error if any step fails.
 **/
export const authenticateAndResetPassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthError | string> => {
  const supabase = await createClient();

  // Verify current password by signing in with it
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: email,
    password: currentPassword,
  });

  if (signInError) {
    return signInError;
  }

  // Update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return updateError;
  }

  // Revoke all other sessions
  const { error: revokeError } = await supabase.auth.signOut({
    scope: "global",
  });

  if (revokeError) {
    return revokeError;
  }

  return "Password Changed! Please login again.";
};

/**
 * Creates a new workspace for the authenticated user by first authenticating the user to retrieve their user ID,
 * and then attempting to insert a new workspace with the provided name. If an error occurs during authentication,
 * or while inserting the workspace (e.g., due to a duplicate workspace name), an appropriate error message is returned.
 * If the workspace is created successfully, the function returns null.
 *
 * @param {string} name - The name of the new workspace.
 * @returns {Error | null} - Returns an error if something goes wrong, otherwise null if the workspace is created successfully.
 **/
export const createWorkspace = async (name: string): Promise<Error | null> => {
  const supabase = await createClient();

  // authenticate and get user id
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // insert new workspace
  const { error: insertionError } = await supabase.from("workspaces").insert({
    user_id: authData.user.id,
    name: name,
  });

  // handle error and response
  if (insertionError) {
    // lookup for duplicate name contraint error
    if (insertionError.message.includes("unique_user_workspace_name")) {
      return new Error("Workspace with that name already exists!");
    }

    return new Error(insertionError.message);
  }

  return null;
};

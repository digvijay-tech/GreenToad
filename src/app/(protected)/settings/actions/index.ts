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

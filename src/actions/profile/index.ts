"use server";

import { createClient } from "@/config/supabase/server";

/**
 * Fetches the authenticated user's profile from the "profiles" table in Supabase.
 *
 * This function retrieves the currently authenticated user using `supabase.auth.getUser()`,
 * and then fetches the user's profile information from the "profiles" table by matching the
 * user's ID. If an error occurs during either the authentication or profile retrieval process,
 * it returns `null`.
 *
 * @returns {Promise<any | null>} The user's profile data if found, or null if an error occurs
 *                                during authentication or profile retrieval.
 **/
export const getUserProfileAction = async (): Promise<unknown | null> => {
  const supabase = await createClient();

  const { data: authResult, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", authResult.user.id);

  if (error) {
    return null;
  }

  return data;
};

export const getUserWorkspacesAction = async () => {
  const supabase = await createClient();

  const { data: authResult, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return null;
  }

  const { data, error } = await supabase
    .from("workspaces")
    .select()
    .eq("user_id", authResult.user.id);

  if (error) {
    return null;
  }

  return data;
};

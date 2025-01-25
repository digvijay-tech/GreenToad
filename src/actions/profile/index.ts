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

/**
 * Fetches the workspaces associated with the currently authenticated user from Supabase.
 *
 * This function first retrieves the currently authenticated user using `supabase.auth.getUser()`.
 * If there is an error fetching the user, it returns `null`.
 * Then, it queries the `workspaces` table in Supabase to fetch all workspaces where the `user_id` matches
 * the authenticated user's `id`. If there is an error during the workspace query, it also returns `null`.
 * If both the user and workspace data are successfully retrieved, the function returns the list of workspaces.
 *
 * @returns {Promise<Workspace[] | null>} A promise that resolves to an array of workspaces if successful,
 * or `null` if an error occurs at any point in the process.
 **/
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

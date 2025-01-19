"use server";

import { createClient } from "@/config/supabase/server";
import { User } from "@supabase/supabase-js";

/**
 * Fetches the current authenticated user from Supabase.
 *
 * This function uses the `supabase.auth.getUser()` method to retrieve the user's data.
 * It returns a `User` object if the user is authenticated, or `null` if no user is found
 * or an error occurs.
 *
 * @returns {Promise<User | null>} The authenticated user object or null if there is no user or an error occurs.
 **/
export const fetchUserAction = async (): Promise<User | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
};

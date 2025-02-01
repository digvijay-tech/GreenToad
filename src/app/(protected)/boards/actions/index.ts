"use server";

import { createClient } from "@/config/supabase/server";
import { parseLogEntry } from "@/utils/format-utils/logs";

/**
 * Creates a new board with the given name and background, and logs the action.
 *
 * @param {string} name - Name of the board.
 * @param {string} background - Background for the board.
 * @returns {Promise<Error | string>} - Success message or an Error object.
 **/
export const createBoard = async (
  name: string,
  background: string,
): Promise<Error | null> => {
  const supabase = await createClient();

  // getting user object from supabase for log entry
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // create log entry
  const log = parseLogEntry("Board Created", `Owner created this board.`);

  if (log instanceof Error) {
    return new Error(log.message);
  }

  // getting workspace_id from user profile
  const { data, error: queryError } = await supabase
    .from("profiles")
    .select()
    .eq("id", authData.user.id);

  if (queryError) {
    return new Error(queryError.message);
  }

  // inserting new board in boards table
  const { error: InsertionError } = await supabase.from("boards").insert({
    name: name,
    background: background,
    changes: [log],
    user_id: authData.user.id,
    workspace_id: data[0].default_workspace_id,
  });

  // when insertion is failed
  if (InsertionError) {
    return new Error(InsertionError.message);
  }

  return null;
};

/**
 * Fetches all boards created by the authenticated user, ordered by creation date (newest first).
 *
 * @returns {Promise<unknown>} - An array of boards or an Error object if the operation fails.
 *
 **/
export const fetchBoards = async (): Promise<Error | unknown[]> => {
  const supabase = await createClient();

  // getting user id
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // getting workspace_id
  const { data: queryData, error: queryError } = await supabase
    .from("profiles")
    .select()
    .eq("id", authData.user.id);

  if (queryError) {
    return new Error(queryError.message);
  }

  // gets boards of current user in last created first order
  const { data: boards, error } = await supabase
    .from("boards")
    .select()
    .eq("workspace_id", queryData[0].default_workspace_id)
    .order("updated_at", { ascending: false });

  if (error) {
    return new Error(error.message);
  }

  return boards;
};

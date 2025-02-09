"use server";

import { createClient } from "@/config/supabase/server";
import { BoardType } from "../../types";

/**
 * Fetches a board by its ID within a specific workspace.
 * Ensures the user is authenticated before querying the database.
 * Returns an error if authentication fails, the board is not found, or if a database error occurs.
 *
 * @param {string} boardId - The unique identifier of the board.
 * @param {string} workspaceId - The unique identifier of the workspace the board belongs to.
 * @returns {Promise<Error | BoardType[]>} - Returns a BoardType array if found, otherwise an Error.
 **/
export const getBoardByIdAction = async (
  boardId: string,
  workspaceId: string,
): Promise<Error | BoardType[]> => {
  const supabase = await createClient();

  // authenticate and get user id
  const { error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // fetch the board data using boardId and workspaceId
  const { data, error } = await supabase
    .from("boards")
    .select()
    .eq("workspace_id", workspaceId)
    .eq("id", boardId);

  if (error) {
    return new Error(error.message);
  }

  if (data.length < 1) {
    return new Error(
      "Board not found or It doesn't belong to your current workspace.",
    );
  }

  // modifying from type `any` to `BoardType array`
  return data as BoardType[];
};

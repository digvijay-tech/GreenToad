"use server";

import { createClient } from "@/config/supabase/server";
import { BoardType } from "./types";

/**
 * Fetches a board by its ID within a specific workspace.
 * Ensures the user is authenticated before querying the database.
 * Returns an error if authentication fails, the board is not found, or if a database error occurs.
 *
 * @param {string} boardId - The unique identifier of the board.
 * @param {string} workspaceId - The unique identifier of the workspace the board belongs to.
 * @returns {Promise<Error | BoardType[]>} - Returns a BoardType array if found, otherwise an Error.
 **/
export const getBoardById = async (
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

/**
 * Toggles the `is_closed` status of a board in a given workspace.
 * Updates the board's `is_closed` field by inverting its current state.
 *
 * Note: Authentication is not enforced in this function (may be considered later).
 *
 * @param {boolean} isClosed - The current `is_closed` status of the board.
 * @param {string} workspaceId - The unique identifier of the workspace the board belongs to.
 * @param {string} boardId - The unique identifier of the board to update.
 * @returns {Promise<Error | string>} - Returns a success message if updated, otherwise an Error.
 **/
export const toggleIsClosedOption = async (
  isClosed: boolean,
  workspaceId: string,
  boardId: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // Note: authentication is not required for now (will think about it later!)

  const { error: updateError } = await supabase
    .from("boards")
    .update({ is_closed: !isClosed })
    .eq("workspace_id", workspaceId)
    .eq("id", boardId);

  if (updateError) {
    return new Error(updateError.message);
  }

  return "Board updated!";
};

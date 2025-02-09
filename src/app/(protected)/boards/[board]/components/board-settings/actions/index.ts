"use server";

import { createClient } from "@/config/supabase/server";
import { parseLogEntry } from "@/utils/format-utils/logs";

/**
 * Updates the cover color aka `background` of a board.
 *
 * @param {string} boardId - The unique identifier of the board.
 * @param {string} workspaceId - The unique identifier of the workspace the board belongs to.
 * @param {string} newColorCode - The new color code to set as the board's cover.
 * @returns {Promise<Error | string>} - Returns a success message or an error if the update fails.
 **/
export const changeCoverByIdAction = async (
  boardId: string,
  workspaceId: string,
  newColorCode: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("boards")
    .update({
      background: newColorCode,
      updated_at: new Date().toISOString(),
    })
    .eq("workspace_id", workspaceId)
    .eq("id", boardId);

  if (updateError) {
    return new Error(updateError.message);
  }

  return "Cover changed!";
};

/**
 * Deletes a board from a workspace.
 *
 * @param {string} boardId - The ID of the board to delete.
 * @param {string} workspaceId - The ID of the workspace the board belongs to.
 * @returns {Promise<Error | string>} - A success message if deleted, or an error if the operation fails.
 **/
export const deleteBoardByIdAction = async (
  boardId: string,
  workspaceId: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // authenticate and get user id
  const { error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // attempt to deletion
  const { error: deletionError } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId)
    .eq("workspace_id", workspaceId);

  if (deletionError) {
    return new Error(deletionError.message);
  }

  return "Board deleted!";
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
export const toggleIsClosedOptionAction = async (
  isClosed: boolean,
  workspaceId: string,
  boardId: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // Note: authentication is not required for now (will think about it later!)

  // update the board
  const { error: updateError } = await supabase
    .from("boards")
    .update({
      is_closed: !isClosed,
      updated_at: new Date().toISOString(),
    })
    .eq("workspace_id", workspaceId)
    .eq("id", boardId);

  if (updateError) {
    return new Error(updateError.message);
  }

  return "Board updated!";
};

/**
 * Renames a board in a workspace and record the changes.
 *
 * @param {string} newName - The new board name.
 * @param {string} workspaceId - The workspace ID.
 * @param {string} boardId - The board ID.
 * @returns {Promise<Error | string>} - Success message or error.
 *
 **/
export const renameBoardAction = async (
  newName: string,
  workspaceId: string,
  boardId: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // Note: authentication is not required for now (will think about it later!)
  // RLS on supabase is enable for UPDATE by authenticated user only.

  // create new log entry
  const log = parseLogEntry(
    "Board Renamed",
    `Owner changed board name to ${newName}.`,
  );

  if (log instanceof Error) {
    return new Error(log.message);
  }

  // getting previous changes array because there isn't a way to append to jsonb[] in supabase directly!
  const { data: queryData, error: queryError } = await supabase
    .from("boards")
    .select("changes")
    .eq("workspace_id", workspaceId)
    .eq("id", boardId)
    .single();

  if (queryError) {
    return new Error("Operation failed, please try again later!");
  }

  // extracting the current changes (if any) and appending the new log entry
  const currentChanges = queryData?.changes || []; // ensure it's an empty array if no changes exist

  // updating board name and logging new change
  const { error: updateError } = await supabase
    .from("boards")
    .update({
      name: newName,
      updated_at: new Date().toISOString(),
      changes: [log, ...currentChanges], // appending new log entry
    })
    .eq("workspace_id", workspaceId)
    .eq("id", boardId);

  if (updateError) return new Error(updateError.message);

  return "Board renamed!";
};

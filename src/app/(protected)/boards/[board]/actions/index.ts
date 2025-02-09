"use server";

import { createClient } from "@/config/supabase/server";
import { BoardType, BoardDeckType } from "./types";
import { parseLogEntry } from "@/utils/format-utils/logs";

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
 * Creates a new deck within a specified board.
 *
 * This function authenticates the user, retrieves the current highest deck order
 * in the given board, and inserts a new deck with an incremented order value.
 *
 * @param {string} workspaceId - The ID of the workspace to which the deck belongs.
 * @param {string} boardId - The ID of the board where the deck will be created.
 * @param {string} name - The name of the new deck.
 * @returns {Promise<Error | string>} - Returns a success message or an error if the operation fails.
 **/
export const createDeckAction = async (
  workspaceId: string,
  boardId: string,
  name: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // authenticating and getting the user id
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // check the number of decks created in this board
  const { data: queryData, error: queryError } = await supabase
    .from("decks")
    .select()
    .eq("board_id", boardId)
    .order("order", { ascending: false })
    .limit(1);

  if (queryError) {
    return new Error(queryError.message);
  }

  // calculating new deck order
  const deckOrder = queryData.length > 0 ? queryData[0].order + 1 : 1;

  // insert row
  const { error: insertionError } = await supabase.from("decks").insert({
    user_id: authData.user.id,
    workspace_id: workspaceId,
    board_id: boardId,
    name: name,
    order: deckOrder,
  });

  if (insertionError) {
    return new Error(insertionError.message);
  }

  return "Deck created!";
};

/**
 * Fetches all decks associated with a specific board and workspace from Supabase.
 *
 * @param {string} boardId - The ID of the board to fetch decks for.
 * @param {string} workspaceId - The ID of the workspace to fetch decks from.
 *
 * @returns {Promise<Error | BoardDeckType[]>} A Promise that resolves with an array of decks for the specified board and workspace,
 *    or an Error if there is an issue with the query.
 *
 * This function interacts with the Supabase database using the RLS (Row-Level Security) policy.
 * Authentication is not required since RLS SELECT policies are configured on the database to allow safe access.
 * If there is an issue during the query execution (e.g., network error or query failure), an Error object is returned.
 */
export const fetchDecksByBoardIdAction = async (
  boardId: string,
  workspaceId: string,
): Promise<Error | BoardDeckType[]> => {
  const supabase = await createClient();

  // Note: Authentication is not required as RLS SELECT Policy is setup on SupaBase.

  const { data: queryData, error: queryError } = await supabase
    .from("decks")
    .select()
    .eq("board_id", boardId)
    .eq("workspace_id", workspaceId)
    .order("order", { ascending: true });

  if (queryError) {
    return new Error(queryError.message);
  }

  return queryData;
};

/**
 * Updates the order of decks in the database by either updating existing records or inserting new ones if they don't exist.
 *
 * @param {BoardDeckType[]} decks - An array of decks to update or insert in the database. Each deck must contain the necessary fields such as `id`, `name`, `order`, etc.
 *
 * @returns {Promise<Error | null>} A Promise that resolves to `null` if the update was successful, or an `Error` if there was an issue with the operation.
 *
 * This function uses the Supabase `upsert` operation to update the `decks` table. If a deck with the same `id` already exists, it will be updated with the new values (e.g., `order`, `name`). If no matching record is found, a new deck is inserted.
 * The `onConflict: "id"` option ensures that the `id` field is used to detect conflicts (i.e., it updates existing records with matching IDs).
 **/
export const updateDeckOrderAction = async (
  decks: BoardDeckType[],
): Promise<Error | null> => {
  const supabase = await createClient();

  const updates = decks.map((deck) => ({
    id: deck.id,
    name: deck.name,
    order: deck.order,
    board_id: deck.board_id,
    user_id: deck.user_id,
    workspace_id: deck.workspace_id,
    created_at: deck.created_at,
    updated_at: deck.updated_at,
  }));

  const { error } = await supabase
    .from("decks")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    return new Error(error.message);
  }

  return null;
};

/**
 * Deletes a deck from the database using its unique ID.
 *
 * @param {string} deckId - The unique identifier of the deck to be deleted.
 *
 * @returns {Promise<Error | string>} A Promise that resolves to a success message if deletion is successful, or an Error if authentication or deletion fails.
 *
 * This function first authenticates the user via Supabase. It then deletes the deck from the `decks` table,
 * ensuring the operation only affects the deck if it belongs to the authenticated user (RLS enforced using the `user_id` column).
 **/
export const deleteDeckByIdAction = async (
  deckId: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // authenticate user before deletion
  const { error: authError, data: authData } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // initiate deletion
  const { error: deletionError } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId)
    .eq("user_id", authData.user.id);

  if (deletionError) {
    return new Error(deletionError.message);
  }

  return "Deck is deleted!";
};

/**
 * Renames a deck in the database using its unique identifier.
 *
 * @param {string} deckId - The unique identifier of the deck to be renamed.
 * @param {string} newName - The new name to assign to the deck.
 *
 * @returns {Promise<Error | string>} A Promise that resolves to a success message if the rename is successful, or an Error if the update fails.
 *
 * This function updates the `name` and `updated_at` fields for a deck in the `decks` table via Supabase.
 * Note: Authentication is not enforced for this operation at present but may be implemented in the future.
 **/
export const renameDeckById = async (
  deckId: string,
  newName: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // Note: Authentication not required for now, but will consider later!

  const { error: updateError } = await supabase
    .from("decks")
    .update({
      name: newName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deckId);

  if (updateError) {
    return new Error(updateError.message);
  }

  return "Deck updated!";
};

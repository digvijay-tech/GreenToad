"use server";

import { createClient } from "@/config/supabase/server";
import { BoardDeckType, CardType } from "@/app/(protected)/boards/types";

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

/**
 * Creates a new Card in the database using Deck's unique identifier and name.
 *
 * @param {string} deckId - The unique identifier of the deck.
 * @param {string} name - The name to assign to the card.
 *
 * @returns {Promise<Error | string>} A Promise that resolves to a success message if the rename is successful, or an Error if the update fails.
 *
 * This function creates the `title`, `order`, and `cover_color` fields for a card in the `cards` table via Supabase.
 * Note: Authentication is enforced to retrive `user_id` from authenticated user.
 **/
export const createCardAction = async (
  deckId: string,
  name: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // default cover color
  const COVER_COLOR = "#ecf0f1";

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // finding the highest order of the card by given deck id
  const { data: queryData, error: queryError } = await supabase
    .from("cards")
    .select()
    .eq("deck_id", deckId)
    .order("order", { ascending: false })
    .limit(1);

  if (queryError) {
    return new Error(queryError.message);
  }

  const computeCardOrder = queryData.length > 0 ? queryData[0].order + 1 : 1;

  // insert card
  const { error: insertionError } = await supabase.from("cards").insert({
    deck_id: deckId,
    user_id: authData.user.id,
    title: name.trim(),
    cover_color: COVER_COLOR,
    order: computeCardOrder,
  });

  if (insertionError) {
    return new Error(insertionError.message);
  }

  return "New card created!";
};

/**
 * Fetches all Cards associated with a given Deck's unique identifier from the database.
 *
 * @param {string} deckId - The unique identifier of the deck.
 *
 * @returns {Promise<Error | CardType[] | null>}
 * A Promise that resolves to one of the following:
 * - `CardType[]`: An array of cards ordered by their `order` field in ascending order.
 * - `null`: If no cards are found for the specified deck.
 * - `Error`: If the query fails due to an error in the database request.
 *
 * This function retrieves data from the `cards` table in Supabase, filtering by the `deck_id` field
 * and ordering the results based on the `order` field.
 * Note: Authentication is not enforced.
 **/
export const fetchCardsByDeckId = async (
  deckId: string,
): Promise<Error | CardType[] | null> => {
  const supabase = await createClient();

  const { data: queryData, error: queryError } = await supabase
    .from("cards")
    .select()
    .eq("deck_id", deckId)
    .order("order", { ascending: true });

  if (queryError) {
    return new Error(queryError.message);
  }

  if (queryData.length < 1) {
    return null; // Cards array is empty
  }

  return queryData as CardType[];
};

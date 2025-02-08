"use server";

import { createClient } from "@/config/supabase/server";

/**
 * Updates the name of a workspace if the user is authenticated.
 *
 * @param {string} newName - The new workspace name.
 * @param {string} workspaceId - The ID of the workspace to rename.
 * @returns {Promise<Error | string>} Returns `null` on success or an `Error` on failure.
 **/
export const renameWorkspaceAction = async (
  newName: string,
  workspaceId: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // authenticate user
  const { error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // update workspace name
  const { error: updateError } = await supabase
    .from("workspaces")
    .update({
      name: newName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", workspaceId);

  if (updateError) {
    // check for duplicate error
    if (updateError.message.includes("unique_user_workspace_name")) {
      return new Error("Workspace with that name already exists!");
    }

    return new Error(updateError.message);
  }

  return "Workspace updated!";
};

/**
 * Deletes a workspace if the user is authenticated.
 *
 * @param {string} workspaceId - The ID of the workspace to delete.
 * @returns {Promise<Error | string>} Returns `null` on success or an `Error` on failure.
 **/
export const deleteWorkspaceAction = async (
  workspaceId: string,
): Promise<Error | string> => {
  const supabase = await createClient();

  // authenticating user
  const { error: authError } = await supabase.auth.getUser();

  if (authError) {
    return new Error(authError.message);
  }

  // delete workspace
  const { error: deletionError } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (deletionError) {
    return new Error(deletionError.message);
  }

  return "Workspace deleted!";
};

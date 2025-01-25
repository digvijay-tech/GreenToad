"use server";

import { createClient } from "@/config/supabase/server";


/**
 * Switches the user's default workspace by updating the `default_workspace_id` 
 * in their profile to the provided workspace ID. Returns an error if the update 
 * fails, otherwise returns null.
 *
 * @param {string} workSpapceId - The ID of the workspace to switch to.
 * @returns {Error | null} - Returns an error if something goes wrong, otherwise null if the workspace is switched successfully.
**/
export const switchWorkspace = async (workSpapceId: string): Promise<Error | null> => {
    const supabase = await createClient();

    // get user id
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
        return new Error(authError.message);
    }

    // update default_workspace_id property on user profile 
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ default_workspace_id: workSpapceId })
        .eq("id", authData.user.id);
    
    if (updateError) {
        return new Error(updateError.message);
    }

    return null;
}

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
): Promise<Error | string>=> {
    const supabase = await createClient();

    // getting user object from supabase for log entry
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return new Error("Authentication Failed! Please try again later.");
    }

    // extracting user email/name (if available) from the user object
    const userIdentifier = user.data.user.email;

    // parse log entry
    const log = parseLogEntry("Board Created", `Owner (${userIdentifier}) created this board.`);

    if (log instanceof Error) {
        return new Error(log.message);
    }

    // inserting new board in boards table
    const { error: InsertionError } = await supabase
        .from("boards")
        .insert({
            name: name,
            background: background,
            changes: [log],
            owner_id: user.data.user.id
        });
    
    // when insertion is failed
    if (InsertionError) {
        return new Error(InsertionError.message);
    }

    return "Board created!";
}



/**
 * Fetches all boards created by the authenticated user, ordered by creation date (newest first).
 *
 * @returns {Promise<unknown>} - An array of boards or an Error object if the operation fails.
 *
**/
export const fetchBoards = async (): Promise<Error | unknown[]> => {
    const supabase = await createClient();

    // getting user object from supabase for log entry
    const user = await supabase.auth.getUser();

    // if current session is lost
    if (!user.data.user) {
        return new Error("Authentication Failed! Please try again later.");
    }

    // gets boards of current user in last created first order
    const { data, error } = await supabase.from("boards")
        .select()
        .eq("owner_id", user.data.user.id)
        .order("updated_at", { ascending: false });
    
    if (error) {
        return new Error(error.message);
    }

    return data;
}

"use server";

import { createClient } from "@/config/supabase/server";
import { parseLogEntry } from "@/utils/format-utils/logs";


// Inserts a new row into the boards table
export const createBoard = async (
    name: string,
    background: string,
) => {
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
    const { data: BoardsArray, error: InsertionError } = await supabase
        .from("Boards")
        .insert({
            name: name,
            background: background,
            changes: [log],
            ownerId: user.data.user.id
        });
    
    // when insertion is failed
    if (InsertionError) {
        return new Error("Operation failed! try again later.");
    }

    return BoardsArray;
}



// fetches the boards that matches with users id
export const fetchBoards = async () => {
    const supabase = await createClient();

    // getting user object from supabase for log entry
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return new Error("Authentication Failed! Please try again later.");
    }

    const { data, error } = await supabase.from("Boards")
        .select()
        .eq("ownerId", user.data.user.id)
        .order("created_at", { ascending: false });
    
    if (error) {
        return new Error(error.message);
    }

    return data;
}

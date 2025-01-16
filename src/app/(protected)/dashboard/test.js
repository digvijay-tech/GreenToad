"use server";

// DELETE LATER!

import { createClient } from "@/config/supabase/client";

export const temp = async () => {
  const supabase = await createClient();

  const res = await supabase.auth.getUser();

  return res.data.user;
};

export const temp2 = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("fruites").select();

  if (!error) {
    return data;
  }

  return null;
};

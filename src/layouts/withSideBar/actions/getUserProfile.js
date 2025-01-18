"use server";

import { createClient } from "@/config/supabase/client";

export const getUserProfile = async () => {
  const supabase = await createClient();

  const res = await supabase.auth.getUser();

  return res.data.user;
};

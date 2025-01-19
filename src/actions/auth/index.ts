"use server";

import { encodedRedirect } from "@/config/utils";
import { createClient } from "@/config/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "@supabase/supabase-js";

/**
 * Handles user signup by validating email and password, and interacting with Supabase to create a new user.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {string | object} - An error message if signup fails, or the Supabase response data on success.
 **/
export const signUpAction = async (
  formData: FormData,
): Promise<string | object> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return "Email and password are required";
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/`,
    },
  });

  if (error) {
    return error;
  } else {
    return data;
  }
};

/**
 * Handles user sign-in by authenticating the user with Supabase using email and password.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {string | void} - An error message if sign-in fails, or redirects to the dashboard on success.
 **/
export const signInAction = async (
  formData: FormData,
): Promise<AuthError | void> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return error;
  }

  return redirect("/dashboard");
};

// Still Working on it!
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return "Email is required";
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/recover-with-link?redirectedFrom=magic-link`,
  });

  if (error) {
    return error;
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return "Check your email for a link to reset your password.";
};

// Still working on it!
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

/**
 * Logs the user out by signing out from Supabase and redirecting to the login page.
 *
 * @returns {void} - Redirects to the homepage after successful sign-out.
 **/
export const signOutAction = async (): Promise<void> => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

/**********************************************************************************
----------------------------- OAUTH SIGNIN ACTIONS --------------------------------
***********************************************************************************/
/**
 * Initiates OAuth sign-in with Respective Identity Provider via Supabase and redirects the user to the callback URL.
 *
 * @returns {void | string} - Redirects to Identity Provider for authentication or returns an error if the sign-in fails.
 **/
export const signInWithGithub = async (): Promise<AuthError | void> => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return error;
  }

  redirect(data.url);
};

export const signInWithApple = async (): Promise<AuthError | void> => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return error;
  }

  redirect(data.url);
};

export const signInWithGoogle = async (): Promise<AuthError | void> => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return error;
  }

  redirect(data.url);
};

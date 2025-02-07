"use server";

import { encodedRedirect } from "@/config/utils";
import { createClient } from "@/config/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError, User } from "@supabase/supabase-js";

/**
 * Handles user signup by validating email and password, and interacting with Supabase to create a new user.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {Error | string} - An error message if signup fails, or the Supabase response data on success.
 **/
export const signUpAction = async (
  formData: FormData,
): Promise<Error | string> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return new Error("Email and password are required");
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/`,
    },
  });

  if (authError) {
    return new Error(authError.message);
  }

  if (!authData.user) {
    return new Error(
      "Thank you for signin-up. Please follow the instructions on the confirmation email that we sent.",
    );
  }

  return `Thank you for signin-up. Please follow the instructions on the confirmation email that we sent on ${authData.user.email}`;
};

/**
 * Handles user sign-in by authenticating the user with Supabase using email and password.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {Error | void} - An error message if sign-in fails, or redirects to the dashboard on success.
 **/
export const signInAction = async (
  formData: FormData,
): Promise<Error | void> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Error(error.message);
  }

  // redirecting on success
  return redirect("/dashboard");
};

// Still Working on it!
export const forgotPasswordAction = async (
  formData: FormData,
): Promise<Error | string> => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return new Error("Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/recover-with-link?redirectedFrom=magic-link`,
  });

  if (error) {
    return new Error(error.message);
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

/**
 * Fetches the current authenticated user from Supabase.
 *
 * This function uses the `supabase.auth.getUser()` method to retrieve the user's data.
 * It returns a `User` object if the user is authenticated, or `null` if no user is found
 * or an error occurs.
 *
 * @returns {Promise<User | null>} The authenticated user object or null if there is no user or an error occurs.
 **/
export const getAuthenticatedUserAction = async (): Promise<User | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
};

/**********************************************************************************
----------------------------- OAUTH SIGNIN ACTIONS --------------------------------
***********************************************************************************/
/**
 * Initiates OAuth sign-in with Respective Identity Provider via Supabase and redirects the user to the callback URL.
 *
 * @returns {void | string} - Redirects to Identity Provider for authentication or returns an error if the sign-in fails.
 **/
export const signInWithGithubAction = async (): Promise<AuthError | void> => {
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

export const signInWithAppleAction = async (): Promise<AuthError | void> => {
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

export const signInWithGoogleAction = async (): Promise<AuthError | void> => {
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

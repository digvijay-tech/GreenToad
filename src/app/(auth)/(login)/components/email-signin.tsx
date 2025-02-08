"use client";

import Link from "next/link";
import React, { useState } from "react";
import { signInAction } from "@/actions/auth";
import { LoadingStateButtonWithText } from "@/components/interactive-buttons/loading-state-button";
import { isEmail } from "validator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailIcon from "@mui/icons-material/Email";

export function EmailSignIn() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // handling email sign-in
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // start loading state
    setIsLoading(true);

    // voiding null value
    if (!email || !password) {
      setEmailError("Missing required inputs!");
      setIsLoading(false);
      return;
    }

    // validating email input
    if (!isEmail(email)) {
      setEmailError("Email is invalid!");
      setIsLoading(false);
      return;
    }

    // validate password input
    setEmailError(null);

    if (password.length > 22) {
      setPasswordError("Password is too long!");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password is too short!");
      setIsLoading(false);
      return;
    }

    // remove errors
    setEmailError(null);
    setPasswordError(null);

    // preparing payload in FormData format
    const fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);

    // sending data to supabase for authentication
    const error = await signInAction(fd);

    if (error instanceof Error) {
      setPasswordError(error.message);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleEmailSignIn}>
        <div className="text-left">
          <Label htmlFor="emailInput">Email</Label>
          <Input
            type="email"
            id="emailInput"
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={isLoading}
            required
          />
          <p
            className={`${!emailError ? "hidden" : "visible"} mt-1 text-sm font-medium leading-none text-red-400`}
          >
            {emailError}
          </p>
        </div>
        <div className="text-left mt-2">
          <Label htmlFor="passwordInput">Password</Label>
          <Input
            type="password"
            id="passwordInput"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value.trim())}
            disabled={isLoading}
            required
          />
          <p
            className={`${!passwordError ? "hidden" : "visible"} mt-1 text-sm font-medium leading-none text-red-400`}
          >
            {passwordError}
          </p>
        </div>
        <div className="text-left mt-2">
          <Link href="/forgot-password" className="hover:underline">
            Forgot Password
          </Link>
        </div>
        <div className="text-left mt-4">
          <LoadingStateButtonWithText
            isLoading={isLoading}
            icon={EmailIcon}
            type="submit"
            variant="default"
            text="Continue with Email"
          />
        </div>

        <div className="text-center mt-3">
          Don&apos;t have an account?
          <Link href="/signup" className="ml-2 underline hover:no-underline">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { signInAction } from "@/actions/auth";
import { isEmail } from "validator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EmailIcon from "@mui/icons-material/Email";
import { Loader2 } from "lucide-react";

export function EmailSignIn() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // handling email sign-in
  const handleEmailSignIn = async (e) => {
    e.preventDefault();

    // start loading state
    setIsLoading(true);

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
    setPasswordError(error.message);
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
          {isLoading ? (
            <Button className="w-full py-5" disabled>
              <Loader2 className="animate-spin !size-5" />
              <p className="text-md">Loading..</p>
            </Button>
          ) : (
            <Button type="submit" className="w-full py-5">
              <EmailIcon className="!size-6" />
              <p className="text-md">Continue with Email</p>
            </Button>
          )}
        </div>

        <div className="text-center mt-3">
          Don't have an account?
          <Link href="/signup" className="ml-2 underline hover:no-underline">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}

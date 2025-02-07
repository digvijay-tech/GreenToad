// Email Signup Form
"use client";

import React, { useState } from "react";
import { isEmail } from "validator";
import { isValidPassword } from "@/utils/validators";
import { PASSWORD_MAXLEN, PASSWORD_MINLEN } from "@/utils/constants/password";
import { signUpAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCheckIcon } from "lucide-react";

export function EmailSignUp() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [createPassword, setCreatePassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // handles supabase email signup and user input validation
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isEmail(email)) {
      setIsLoading(false);
      setError("Email is invalid!");
      return;
    }

    if (!isValidPassword(createPassword)) {
      setIsLoading(false);
      setError(
        "Password is weak. Please use combination of uppercase and lowercase characters, numbers and special symbol.",
      );
      return;
    }

    // compare passwords
    if (createPassword !== confirmPassword) {
      setIsLoading(false);
      setError("Passwords don't match!");
      return;
    }

    // preparing payload in form-data format
    const fd = new FormData();
    fd.append("email", email);
    fd.append("password", confirmPassword);

    // sending form-data object to supabase
    const result = await signUpAction(fd);

    if (result instanceof Error) {
      setEmail("");
      setCreatePassword("");
      setConfirmPassword("");
      setSuccessMessage(null);
      setError(result.message);
      setIsLoading(false);
      return;
    }

    setEmail("");
    setCreatePassword("");
    setConfirmPassword("");
    setError(null);
    setSuccessMessage(result);
    setIsLoading(false);
  };

  return (
    <div>
      {/* Rendering Success Messages */}
      {successMessage && (
        <Alert variant="default" className="my-3">
          <CheckCheckIcon className="h-6 w-6" color="#2ecc71" />
          <AlertTitle>🎉 Hooray!</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Rendering Error Messages */}
      {error && (
        <Alert variant="destructive" className="my-3">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleEmailSignUp}>
        <div>
          <Label htmlFor="emailInput">Email</Label>
          <Input
            id="emailInput"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={isLoading}
            maxLength={60}
            required
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="passOneInput">Create Password</Label>
          <Input
            id="passOneInput"
            type="password"
            autoComplete="new-password"
            value={createPassword}
            onChange={(e) => setCreatePassword(e.target.value.trim())}
            disabled={isLoading}
            maxLength={PASSWORD_MAXLEN}
            minLength={PASSWORD_MINLEN}
            required
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="passTwoInput">Confirm Password</Label>
          <Input
            id="passTwoInput"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value.trim())}
            disabled={isLoading}
            maxLength={PASSWORD_MAXLEN}
            minLength={PASSWORD_MINLEN}
            required
          />
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Button className="w-full md:w-auto" disabled>
              <Loader2 className="animate-spin" />
              Loading..
            </Button>
          ) : (
            <Button type="submit" className="w-full md:w-auto">
              Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

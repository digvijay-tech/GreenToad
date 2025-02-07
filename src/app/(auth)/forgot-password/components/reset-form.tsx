// Forgot Password Reset Form
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { isEmail } from "validator";
import { forgotPasswordAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import EmailIcon from "@mui/icons-material/Email";

export function ResetPasswordForm() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // handles password reset flow
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // validate email input
    if (!isEmail(email)) {
      setError("Email is invalid!");
      setIsLoading(false);
      return;
    }

    // preparing payload in form-data format
    const fd = new FormData();
    fd.append("email", email);

    // sending form-data to supabase
    const result = await forgotPasswordAction(fd);

    if (result instanceof Error) {
      setSuccessMessage(null);
      setError(result.message);
      setIsLoading(false);
      return;
    }

    // on success
    setError(null);
    setSuccessMessage(result);
    setEmail("");
    setIsLoading(false);
  };

  return (
    <div className="text-left">
      {/* Rendering Success Messages */}
      {successMessage && (
        <Alert variant="default" className="my-3">
          <AlertCircle className="h-4 w-4" color="#2ecc71" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Rendering Error Messages */}
      {error && (
        <Alert variant="destructive" className="my-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handlePasswordReset}>
        <div className="mt-3 text-left">
          <Label htmlFor="emailInput">Enter Email</Label>
          <Input
            id="emailInput"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={isLoading}
            required
          />
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Button className="w-full" disabled>
              <Loader2 className="animate-spin" />
              Loading..
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              <EmailIcon className="!size-6" />
              Send Email
            </Button>
          )}
        </div>
        <div className="mt-3">
          <p className="">
            Go back to
            <Link href="/" className="ml-2 underline hover:no-underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

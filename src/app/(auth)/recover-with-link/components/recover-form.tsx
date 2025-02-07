// Account Recover/Password Reset Form
"use client";

import React, { useState } from "react";
import { isValidPassword } from "@/utils/validators";
import { PASSWORD_MINLEN, PASSWORD_MAXLEN } from "@/utils/constants/password";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export function RecoverForm() {
  const [createPassword, setCreatePassword] = useState<string | null>(null);
  const [repeatPassword, setRepeatPassword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);

    // avoiding null values
    if (!createPassword || !repeatPassword) {
      setError("Missing required inputs!");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(repeatPassword)) {
      setError("Password is not acceptable!");
      setIsLoading(false);
      return;
    }

    if (createPassword !== repeatPassword) {
      setError("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    // handle api call
    console.log(createPassword, repeatPassword);
  };

  return (
    <div>
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
        <div className="mt-2">
          <Label htmlFor="passwordOne">Create Password</Label>
          <Input
            id="passwordOne"
            type="password"
            onChange={(e) => setCreatePassword(e.target.value.trim())}
            minLength={PASSWORD_MINLEN}
            maxLength={PASSWORD_MAXLEN}
            disabled={isLoading}
            required
          />
        </div>

        <div className="mt-2">
          <Label htmlFor="passwordTwo">Repeat Password</Label>
          <Input
            id="passwordTwo"
            type="password"
            onChange={(e) => setRepeatPassword(e.target.value.trim())}
            minLength={PASSWORD_MINLEN}
            maxLength={PASSWORD_MAXLEN}
            disabled={isLoading}
            required
          />
        </div>

        <div className="mt-3">
          {isLoading ? (
            <Button type="button" className="w-full select-none" disabled>
              <Loader2 className="animate-spin" />
              Loading..
            </Button>
          ) : (
            <Button type="submit" className="w-full select-none">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

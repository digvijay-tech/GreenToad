// Email Signup Form
"use client";

import { useState } from "react";
import { isEmail } from "validator";
import { validatePassword } from "@/utils/validators";
import { signUpAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCheckIcon } from "lucide-react";


export function EmailSignUp() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handles supabase email signup and user input validation
  const handleEmailSignUp = async (e) => {
    e.preventDefault();

    // start loader
    setIsLoading(true);

    // validate email
    if (!isEmail(email)) {
      setIsLoading(false);
      setError("Email is invalid!");
      return;
    }

    // validate password
    if (!validatePassword(createPassword)) {
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

    // on error response
    if (result.message) {
      // clear inputs
      setEmail("");
      setCreatePassword("");
      setConfirmPassword("");

      // clear success message (if any)
      setSuccessMessage(null);

      // render server error
      setError(result.message);
      setIsLoading(false);
      return;
    }

    // on success response
    if (result.user) {
      // clear inputs
      setEmail("");
      setCreatePassword("");
      setConfirmPassword("");

      // clear server error
      setError(null);

      // render success message
      const msg = `Thank you for signin-up. Please follow the instructions on the confirmation email that we sent on ${result.user.email}`;
      setSuccessMessage(msg);
      setIsLoading(false);
      return;
    }

    // for unexpected things
    setError("Something went wrong, please try again later!");
    setIsLoading(false);
  };

  return (
    <div>
      {/* Rendering Success Messages */}
      {successMessage && (
        <Alert variant="success" className="my-3">
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
            maxLength={22}
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
            maxLength={22}
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

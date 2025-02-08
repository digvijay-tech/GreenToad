"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useUserProfileContext } from "@/contexts/profile/index";
import { authenticateAndResetPasswordAction } from "../actions/index";
import { useToast } from "@/hooks/use-toast";
import { isValidPassword } from "@/utils/validators/index";
import { errorToast, successToast } from "@/utils/toasts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ResetPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, getUser, removeUserProfileContext } = useUserProfileContext();
  const [isEmailProvider, setIsEmailProvider] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [createPassword, setCreatePassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // authenticates with supabase and updates password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // when email is missing
    if (!email) {
      errorToast(toast, "Couldn't get email, please logout and try again!");
      setIsLoading(false);
      return;
    }

    // validating password inputs
    if (!isValidPassword(currentPassword)) {
      errorToast(toast, "Invalid current password!");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(createPassword)) {
      errorToast(toast, "Created password is invalid!");
      setIsLoading(false);
      return;
    }

    // comparing passwords
    if (createPassword !== confirmPassword) {
      errorToast(toast, "Passwords don't match!");
      setIsLoading(false);
      return;
    }

    // authenticating and updating password
    const result = await authenticateAndResetPasswordAction(
      email,
      currentPassword,
      confirmPassword,
    );

    if (result instanceof Error) {
      errorToast(toast, result.message);
      setIsLoading(false);
      return;
    }

    // on success, remove user state and redirect to login
    removeUserProfileContext();
    successToast(toast, result);

    // redirecting user back to login page
    router.push("/");

    // clear all fields
    setCurrentPassword("");
    setCreatePassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };

  // gets user's email from context
  useEffect(() => {
    (async function () {
      const profile = await getUser();

      if (profile) {
        setEmail(profile.email);
        setIsEmailProvider(profile.app_metadata.provider === "email");
      }
    })();
  }, [user]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          {isEmailProvider
            ? "Resetting your password will sign you out of all devices for security purposes."
            : "Since you signed in with an external provider like Google, GitHub, or Apple, please reset your password through their account settings page."}
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <form onSubmit={handlePasswordReset}>
          <div>
            <Label htmlFor="currentPasswordInput">Current Password</Label>
            <Input
              type="password"
              id="currentPasswordInput"
              maxLength={22}
              disabled={isLoading || !isEmailProvider}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value.trim())}
              required
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="createPasswordInput">Create Password</Label>
            <Input
              type="password"
              id="createPasswordInput"
              maxLength={22}
              disabled={isLoading || !isEmailProvider}
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value.trim())}
              required
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="confirmPasswordInput">Repeat Password</Label>
            <Input
              type="password"
              id="confirmPasswordInput"
              maxLength={22}
              disabled={isLoading || !isEmailProvider}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
              required
            />
          </div>

          <div className="mt-3">
            {isLoading ? (
              <Button className="w-full md:w-auto select-none" disabled>
                <Loader2 className="animate-spin" />
                Loading..
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full md:w-auto select-none"
                disabled={!isEmailProvider}
              >
                Change Password
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

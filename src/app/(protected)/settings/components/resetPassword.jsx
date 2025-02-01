"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserProfileContext } from "@/contexts/profile/index";
import { authenticateAndResetPassword } from "../actions/index";
import { useToast } from "@/hooks/use-toast";
import { isValidPassword } from "@/utils/validators/index";
import { errorToast } from "@/utils/toasts";
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
  const [isEmailProvider, setIsEmailProvider] = useState(false);
  const [email, setEmail] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // authenticates with supabase and updates password
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // start loading state
    setIsLoading(true);

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
    try {
      const result = await authenticateAndResetPassword(
        email,
        currentPassword,
        confirmPassword,
      );

      // checking if result is type of error
      if (result instanceof Error) {
        throw result;
      }

      // on success, remove user state and redirect to login
      removeUserProfileContext();

      toast({
        title: "Success",
        description: result,
        style: {
          color: "#2ecc71",
          textAlign: "justify",
        },
      });

      // redirecting user back to login page
      router.push("/");
    } catch (e) {
      console.log(e);
      if (!e.message) {
        errorToast(toast, "Something went wrong!");
      } else {
        errorToast(toast, e.message);
      }
    }

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

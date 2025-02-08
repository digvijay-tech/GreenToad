"use client";

// Social Sign-in Buttons
import React, { JSX, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorToast } from "@/utils/toasts";
import {
  signInWithGithubAction,
  signInWithAppleAction,
  signInWithGoogleAction,
} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { GoogleLogoIcon } from "@/components/icons/google";
import { BlackAppleLogoIcon } from "@/components/icons/apple";
import { BlackGitHubLogoIcon } from "@/components/icons/github";

interface IdentityProviderType {
  name: string;
  icon: { (): JSX.Element; (): JSX.Element; (): JSX.Element };
  cb: () => Promise<Error | void>;
}

export function SocialSignInButton({
  identityProvider,
}: {
  identityProvider: string;
}) {
  const { toast } = useToast();
  const [currentProvider, setCurrentProvider] = useState<
    IdentityProviderType | undefined
  >(undefined);

  // handles OAuth signin by given provider
  const handleOAuthSignIn = async (handler: () => Promise<Error | void>) => {
    const error = await handler();

    if (error instanceof Error) {
      errorToast(toast, error.message);
      return;
    }
  };

  const providers: Map<string, IdentityProviderType> = new Map();
  providers.set("google", {
    name: "Google",
    icon: GoogleLogoIcon,
    cb: () => handleOAuthSignIn(signInWithGoogleAction),
  });
  providers.set("apple", {
    name: "Apple",
    icon: BlackAppleLogoIcon,
    cb: () => handleOAuthSignIn(signInWithAppleAction),
  });
  providers.set("github", {
    name: "GitHub",
    icon: BlackGitHubLogoIcon,
    cb: () => handleOAuthSignIn(signInWithGithubAction),
  });

  useEffect(() => {
    setCurrentProvider(providers.get(identityProvider));
  }, [identityProvider]);

  return (
    <div>
      {currentProvider && (
        <Button
          variant="outline"
          onClick={currentProvider.cb}
          className="w-full py-5 text-slate-800"
        >
          <span className="h-9 w-8 flex jusitify-center items-center">
            <currentProvider.icon />
          </span>
          <p className="text-md">Continue with {currentProvider.name}</p>
        </Button>
      )}
    </div>
  );
}

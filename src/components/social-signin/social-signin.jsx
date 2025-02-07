"use client";

// Social Sign-in Buttons
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  signInWithGithubAction,
  signInWithAppleAction,
  signInWithGoogleAction,
} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { GoogleLogoIcon } from "@/components/icons/google";
import { BlackAppleLogoIcon } from "@/components/icons/apple";
import { BlackGitHubLogoIcon } from "@/components/icons/github";

// Displays error messages in a toast
const errorToast = (message) => {
  const { toast } = useToast();

  toast({
    title: "Error",
    description: message,
    style: {
      color: "#e74c3c",
      textAlign: "justify",
    },
  });
};

// handles OAuth signin by given provider
const handleOAuthSignIn = async (handler) => {
  const error = await handler();

  if (error) {
    if (!error.message) {
      errorToast("Something went wrong!");
      return;
    }

    errorToast(error.message);
  }
};

// fixed oauth providers and their props
class Provider {
  constructor(name, icon, cb) {
    (this.name = name), (this.icon = icon), (this.cb = cb);
  }
}

const google = new Provider("Google", GoogleLogoIcon, () =>
  handleOAuthSignIn(signInWithGoogleAction),
);

const apple = new Provider("Apple", BlackAppleLogoIcon, () =>
  handleOAuthSignIn(signInWithAppleAction),
);
const github = new Provider("GitHub", BlackGitHubLogoIcon, () =>
  handleOAuthSignIn(signInWithGithubAction),
);

const providers = new Map();
providers.set("google", google);
providers.set("apple", apple);
providers.set("github", github);

export function SocialSignInButton({ identityProvider }) {
  const [currentProvider, setCurrentProvider] = useState(null);

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

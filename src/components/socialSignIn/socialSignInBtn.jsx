"use client";

// Social Sign-in Buttons
import Image from "next/image";
import { useEffect, useState } from "react";
import { signInWithGithub, signInWithApple, signInWithGoogle } from "@/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


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
}

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
}

// fixed oauth providers and their props
class Provider {
  constructor(name, imageUrl, aspectRatio, cb) {
    this.name = name,
    this.imageUrl = imageUrl,
    this.aspectRatio = aspectRatio,
    this.cb = cb
  }
}

const google = new Provider("Google", "/google-logo.png", 20, () => handleOAuthSignIn(signInWithGoogle));
const microsoft = new Provider("Microsoft", "/microsoft-logo.png", 23, () => console.log("Signin with: Microsoft"));
const apple = new Provider("Apple", "/apple-logo.png", 20, () => handleOAuthSignIn(signInWithApple));
const github = new Provider("GitHub", "/github-logo.png", 23, () => handleOAuthSignIn(signInWithGithub));

const providers = new Map();
providers.set("google", google);
providers.set("microsoft", microsoft);
providers.set("apple", apple);
providers.set("github", github);


export function SocialSignInButton({ identityProvider }) {
  const [currentProvider, setCurrentProvider] = useState(null);

  useEffect(() => {
    setCurrentProvider(providers.get(identityProvider));
  }, []);

  return (
    <div>
      {currentProvider && (
        <Button
            onClick={currentProvider.cb}
            className="w-full py-5 shadow-md  text-slate-800 bg-[#ffffff] hover:bg-[#fefefe] hover:shadow"
          >
            <Image src={currentProvider.imageUrl} width={currentProvider.aspectRatio} height={currentProvider.aspectRatio} alt={`${currentProvider.name} Logo`} />
            <p className="text-md">
              Continue with { currentProvider.name }
            </p>
        </Button>
      )}
    </div>
  );
}

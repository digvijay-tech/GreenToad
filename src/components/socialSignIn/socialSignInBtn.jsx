"use client";

// Social Sign-in Buttons
import { Button } from "@/components/ui/button";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import AppleIcon from "@mui/icons-material/Apple";
import GitHubIcon from "@mui/icons-material/GitHub";

// Fixed User Identity Providers
const google = "google";
const microsoft = "microsoft";
const apple = "apple";
const github = "github";

export function SocialSignInButton({ identityProvider }) {
  const tempHandler = () => console.log("Signing-in with", identityProvider);

  return (
    <div>
      {identityProvider === google && (
        <Button
          onClick={tempHandler}
          className="w-full py-5 bg-[#0984e3] hover:bg-[#107acb]"
        >
          <GoogleIcon className="!size-5" />
          <p className="text-md">Continue with Google</p>
        </Button>
      )}

      {identityProvider === microsoft && (
        <Button
          onClick={tempHandler}
          className="w-full py-5 bg-[#0652DD] hover:bg-[#0647c0]"
        >
          <MicrosoftIcon className="!size-5" />
          <p className="text-md">Continue with Microsoft</p>
        </Button>
      )}

      {identityProvider === apple && (
        <Button
          onClick={tempHandler}
          className="w-full py-5 bg-[#1e272e] hover:bg-[#080a0b]"
        >
          <AppleIcon className="!size-6" />
          <p className="text-md">Continue with Apple</p>
        </Button>
      )}

      {identityProvider === github && (
        <Button
          onClick={tempHandler}
          className="w-full py-5 bg-[#636e72] hover:bg-[#52585a]"
        >
          <GitHubIcon className="!size-6" />
          <p className="text-md">Continue with GitHub</p>
        </Button>
      )}
    </div>
  );
}

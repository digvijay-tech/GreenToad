// Signup Page Layout
import Link from "next/link";
import { AnimatedWindow } from "./animatedWindow";
import { SignUpNavbar } from "./localNavbar";
import { HeadingTwo } from "@/components/typography/headings";
import { EmailSignUp } from "./emailSignUp";
import { SocialSignInButton } from "@/components/socialSignIn/socialSignInBtn";
import { Separator } from "@/components/ui/separator";

export function SignUpLayout({ pageHeading }) {
  return (
    <main>
      <div className="h-screen flex flex-row items-center">
        {/* Left Window */}
        <div className="h-full flex-1">
          <SignUpNavbar />

          <div className="py-6 px-8">
            <HeadingTwo text={pageHeading} />

            {/* Email & Password Signup Option */}
            <EmailSignUp />

            <div className="my-4 flex flex-row items-center justify-between items-center">
              <Separator className="flex-1" />
              <p className="mx-3 text-sm font-medium leading-none">or</p>
              <Separator className="flex-1" />
            </div>

            {/* Social Signup Option */}
            {["google", "microsoft", "apple", "github"].map((ip, id) => (
              <div key={id} className="mt-2">
                <SocialSignInButton identityProvider={ip} />
              </div>
            ))}

            <div className="mt-5">
              <p className="text-center">
                Already have an account?
                <Link href="/" className="ml-2 text-green-500 hover:underline">
                  Login Instead
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Window */}
        <div className="h-full flex-1 hidden md:block">
          <AnimatedWindow />
        </div>
      </div>
    </main>
  );
}

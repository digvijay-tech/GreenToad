// Login Page Layout
import { Separator } from "@/components/ui/separator";
import { HeadingTwo } from "@/components/typography/headings";
import { SocialSignInButton } from "@/components/socialSignIn/socialSignInBtn";
import { EmailSignIn } from "./emailSignIn";

export function LoginLayout({ pageHeading }) {
  return (
    <main className="h-screen">
      <div className="container h-[100%] mx-auto flex flex-col items-center justify-center">
        {/* Centered Content */}
        <div className="w-[80%] sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[30%] text-center">
          <HeadingTwo text={pageHeading} />

          {/* Social Sign-in options */}
          {["google", "microsoft", "apple", "github"].map((ip, id) => (
            <div key={id} className="mt-2">
              <SocialSignInButton identityProvider={ip} />
            </div>
          ))}

          <div className="my-4 flex flex-row items-center justify-between items-center">
            <Separator className="flex-1" />
            <p className="mx-3 text-sm font-medium leading-none">or</p>
            <Separator className="flex-1" />
          </div>

          {/* Email & Password Sign-in option */}
          <EmailSignIn />
        </div>
      </div>
    </main>
  );
}

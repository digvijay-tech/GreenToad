// Forgot Password Page Layout
import { HeadingTwo } from "@/components/typography/headings";
import { ResetPasswordForm } from "./reset-form";

export function ForgotPasswordLayout({ pageHeading }: { pageHeading: string }) {
  return (
    <main className="h-screen">
      <div className="container h-[100%] mx-auto flex flex-col items-center justify-center">
        {/* Centered Content */}
        <div className="w-[80%] sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[30%] text-center">
          <HeadingTwo text={pageHeading} />

          <p className="">
            We&apos;ll send you a link with instructions on how to reset your
            password.
          </p>

          {/* Reset Password Form */}
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}

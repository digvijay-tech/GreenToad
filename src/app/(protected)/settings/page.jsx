import { HeadingTwo } from "@/components/typography/headings";
import { ResetPassword } from "./components/resetPassword";

export default function Settings() {
  return (
    <div className="mt-[60px] container mx-auto">
      {/* Page Heading */}
      <HeadingTwo text="Settings" />

      {/* Options */}
      <div className="mt-5">
        <ResetPassword />
      </div>
    </div>
  );
}

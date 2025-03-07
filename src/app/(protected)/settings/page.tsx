import { HeadingTwo } from "@/components/typography/headings";
import { ResetPassword } from "./components/reset-password";
import { CreateWorkspace } from "./components/create-workspace";
import { ManageWorkspacesButton } from "./components/manage-workspaces";

export default function Settings() {
  return (
    <div className="mt-[60px] container mx-auto p-4">
      {/* Page Heading */}
      <HeadingTwo text="Settings" />

      {/* Workspace Management */}
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <CreateWorkspace />
          </div>
          <div className="lg:col-span-2">
            <ManageWorkspacesButton />
          </div>
        </div>
      </div>

      {/* Password Reset */}
      <div className="mt-5">
        <ResetPassword />
      </div>
    </div>
  );
}

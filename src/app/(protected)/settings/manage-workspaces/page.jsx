"use client";

import { useState, useEffect } from "react";
import { useUserProfileContext } from "@/contexts/profile";
import { HeadingTwo } from "@/components/typography/headings";
import { WorkspaceControlTile } from "./components/controlTile";

export default function ManageWorkspaces() {
  const { workspaces, getWorkspaces, profile, getProfile } =
    useUserProfileContext();
  const [availableWorkspaces, setAvailableWorkspaces] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // on load and workspace change
  useEffect(() => {
    (async function () {
      const workspaceResult = await getWorkspaces();
      const profileResult = await getProfile();

      if (workspaceResult && profileResult) {
        setAvailableWorkspaces(workspaceResult);
        setUserProfile(profileResult);
      }
    })();
  }, [workspaces, profile]);

  return (
    <div className="mt-[60px] container mx-auto p-4">
      <HeadingTwo text="Manage Your Workspaces" />

      {availableWorkspaces && userProfile ? (
        <div className="mt-5">
          {availableWorkspaces.map((ws) => (
            <WorkspaceControlTile
              key={ws.id}
              id={ws.id}
              name={ws.name}
              created_at={ws.created_at}
              updated_at={ws.updated_at}
              currentWorkspaceId={userProfile.default_workspace_id}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-6">Loading..</p>
      )}
    </div>
  );
}

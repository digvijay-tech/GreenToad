"use client";

import moment from "moment";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileContext } from "@/contexts/profile";
import { renameWorkspaceAction } from "../actions";
import { DeleteWorkspaceButton } from "./delete-workspace";
import { successToast, errorToast } from "@/utils/toasts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkspaceControlTileProps {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  currentWorkspaceId: string;
}

export function WorkspaceControlTile({
  id,
  name,
  created_at,
  updated_at,
  currentWorkspaceId,
}: WorkspaceControlTileProps) {
  const { toast } = useToast();
  const { removeUserProfileContext } = useUserProfileContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [workspaceName, setWorkspaceName] = useState<string>(name);

  // handle rename call and save/update state
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsEditing(true);

    // validate new name
    if (workspaceName.length < 3 || workspaceName.length > 24) {
      errorToast(
        toast,
        "Name should be between 3 and 24 characters in length!",
      );
      setIsLoading(false);
      setIsEditing(false);
      return;
    }

    // handle api call
    const result = await renameWorkspaceAction(workspaceName, id);

    if (result instanceof Error) {
      setWorkspaceName(name);
      errorToast(toast, result.message);
      setIsLoading(false);
      setIsEditing(false);
      return;
    }

    // initiate profile + workspace context refetch
    removeUserProfileContext();
    setIsLoading(false);
    setIsEditing(false); // togggle button from save to edit
    successToast(toast, result);
  };

  return (
    <div className="mt-3 px-3 py-4 border rounded-lg">
      <form onSubmit={handleRename}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex-1 mr-2">
            <Input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={!isEditing}
              minLength={3}
              maxLength={24}
              required
            />
          </div>
          <div className="flex-2">
            {isLoading ? (
              <Button className="select-none w-full" disabled>
                Loading..
              </Button>
            ) : (
              <>
                {isEditing && (
                  <Button type="submit" className="select-none w-full">
                    Save
                  </Button>
                )}

                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    type="button"
                    className="select-none w-full"
                  >
                    Rename
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </form>

      {/* Current Active Workspace Badge */}
      {currentWorkspaceId === id && (
        <div className="mt-3">
          <Badge variant="outline">Current Workspace</Badge>
        </div>
      )}

      {/* Timestamps */}
      <div className="mt-3 select-none">
        <p className="text-xs text-muted-foreground">
          Created On: {moment(created_at).format("DD MMM YYYY hh:mm:ss Z")}
        </p>
        <p className="text-xs text-muted-foreground">
          Updated On: {moment(updated_at).format("DD MMM YYYY hh:mm:ss Z")}
        </p>
      </div>

      {/* Delete Dialog Trigger */}
      <div className="mt-5">
        {/* Disabled button and note */}
        {currentWorkspaceId === id && (
          <Button
            type="button"
            variant="outline"
            className="text-red-400 hover:text-red-400 select-none"
            disabled
          >
            Delete Workspace
          </Button>
        )}

        {currentWorkspaceId === id && (
          <p className="text-xs select-none text-justify text-muted-foreground mt-2">
            Note: You can&apos;t delete this workspace as it is currently
            active. Please switch to another workspace to proceed with deletion.
          </p>
        )}

        {/* Delete Consent Dialog */}
        {currentWorkspaceId !== id && (
          <DeleteWorkspaceButton workspaceId={id} />
        )}
      </div>
    </div>
  );
}

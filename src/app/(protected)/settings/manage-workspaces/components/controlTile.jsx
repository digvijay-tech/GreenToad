"use client";

import moment from "moment";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileContext } from "@/contexts/profile";
import { renameWorkspaceAction } from "../actions";
import { DeleteWorkspaceButton } from "./deleteWorkspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Displays error messages in a toast
const errorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    style: {
      color: "#e74c3c",
      textAlign: "justify",
    },
  });
};

// Displays success messages in a toast
const successToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    style: {
      color: "#2ecc71",
      textAlign: "justify",
    },
  });
};

export function WorkspaceControlTile({
  id,
  name,
  created_at,
  updated_at,
  currentWorkspaceId,
}) {
  const { toast } = useToast();
  const { removeUserProfileContext } = useUserProfileContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(name);

  // handle rename call and save/update state
  const handleRename = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // validate new name
    if (workspaceName.length < 3 || workspaceName.length > 24) {
      errorToast(
        toast,
        "Name should be between 3 and 24 characters in length!",
      );
      setIsLoading(false);
      return;
    }

    // handle api call
    try {
      const result = await renameWorkspaceAction(workspaceName, id);

      if (result instanceof Error) {
        throw result;
      }

      // initiate profile + workspace context refetch
      removeUserProfileContext();
      setIsLoading(false);
      setIsEditing(false); // togggle button from save to edit
      successToast(toast, "Workspace name updated!");
    } catch (e) {
      setIsLoading(false);

      if (e instanceof Error) {
        errorToast(toast, e.message);
        return;
      } else {
        errorToast(toast, "Something went wrong!");
        return;
      }
    }
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
            Note: You can't delete this workspace as it is currently active.
            Please switch to another workspace to proceed with deletion.
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

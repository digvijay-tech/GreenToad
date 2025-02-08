"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileContext } from "@/contexts/profile";
import { deleteWorkspaceAction } from "../actions/index";
import { successToast, errorToast } from "@/utils/toasts";
import { LoadingStateButtonWithText } from "@/components/interactive-buttons/loading-state-button";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteWorkspaceButton({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { toast } = useToast();
  const { removeUserProfileContext } = useUserProfileContext();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);

    // make sure workspaceId of a NON-ZERO value
    if (!workspaceId) {
      errorToast(toast, "Workspace ID is missing, please try again later!");
      setIsLoading(false);
      return;
    }

    // handle api call
    const result = await deleteWorkspaceAction(workspaceId);

    if (result instanceof Error) {
      errorToast(toast, result.message);
      setIsLoading(false);
      return;
    }

    // initiate profile + workspace context refetch
    removeUserProfileContext();
    setIsLoading(false);
    setOpen(false); // close alert dialog
    successToast(toast, result);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="text-red-400 hover:text-red-400 select-none"
          onClick={() => setOpen(true)}
        >
          Delete Workspace
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Workspace Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this workspace? This action cannot
            be undone and will permanently remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>

          {/* Delete and Loading Button */}
          <LoadingStateButtonWithText
            isLoading={isLoading}
            type="button"
            variant="destructive"
            text="Delete"
            onClick={handleDelete}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

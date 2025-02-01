"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileContext } from "@/contexts/profile";
import { deleteWorkspaceAction } from "../actions/index";
import { successToast, errorToast } from "@/utils/toasts";
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
import { Loader2 } from "lucide-react";

export function DeleteWorkspaceButton({ workspaceId }) {
  const { toast } = useToast();
  const { removeUserProfileContext } = useUserProfileContext();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    // make sure workspaceId of a NON-ZERO value
    if (!workspaceId) {
      errorToast(toast, "Workspace ID is missing, please try again later!");
      setIsLoading(false);
      return;
    }

    // handle api call
    try {
      const result = await deleteWorkspaceAction(workspaceId);

      if (result instanceof Error) {
        throw result;
      }

      // initiate profile + workspace context refetch
      removeUserProfileContext();
      setIsLoading(false);
      setOpen(false); // close alert dialog
      successToast(toast, "Workspace deleted!");
    } catch (e) {
      setIsLoading(false);

      if (e instanceof Error) {
        errorToast(toast, e.message);
        return;
      } else {
        errorToast(toast, "Something went wrong, please try again later!");
        return;
      }
    }
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
          {isLoading ? (
            <Button className="w-full md:w-auto select-none" disabled>
              <Loader2 className="animate-spin" />
              Loading..
            </Button>
          ) : (
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

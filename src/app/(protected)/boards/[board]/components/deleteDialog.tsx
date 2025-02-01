"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { deleteBoardById } from "../actions";
import { successToast } from "@/utils/toasts";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function DeleteDialog({
  open,
  setOpen,
  boardId,
  workspaceId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: string;
  workspaceId: string;
}) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);

    const result = await deleteBoardById(boardId, workspaceId);

    if (result instanceof Error) {
      setIsLoading(false);
      setError(result.message);
      return;
    }

    successToast(toast, result);
    setError(null);
    setIsLoading(false);
    redirect("/boards"); // after success on deletion user will be redirected to boards page
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Warning: Permanent Deletion of Board</DialogTitle>
          <DialogDescription>
            You are about to delete this board. This action is irreversible, and
            all associated data will be permanently removed. Please confirm that
            you wish to proceed.
          </DialogDescription>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-3">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="flex-1">
              {isLoading ? (
                <Button className="w-full select-none" disabled>
                  <Loader2 className="animate-spin" />
                  Loading..
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full select-none"
                  disabled={isLoading}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>

            <div className="mx-1"></div>

            <div className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

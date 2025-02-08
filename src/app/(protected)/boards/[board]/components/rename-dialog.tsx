"use client";

import React, { useState } from "react";
import { renameBoardAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function RenameDialog({
  open,
  setOpen,
  boardName,
  boardId,
  workspaceId,
  cb,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  boardName: string;
  boardId: string;
  workspaceId: string;
  cb: () => void;
}) {
  const [name, setName] = useState<string>(boardName);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUnsavedClose = () => {
    setName(boardName);
    setError(null);
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // validate input
    if (name.trim().length < 2 || name.trim().length > 36) {
      setError(
        "The name must be between 2 and 36 characters in length. Please try again!",
      );
      setIsLoading(false);
      return;
    }

    // handle api call
    const result = await renameBoardAction(name, workspaceId, boardId);

    if (result instanceof Error) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    // trigger manual close
    handleUnsavedClose();
    setIsLoading(false);
    setOpen(false);

    cb(); // trigger refresh by parent
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
        onCloseAutoFocus={handleUnsavedClose}
      >
        <DialogHeader>
          <DialogTitle>Edit Name</DialogTitle>
          <DialogDescription>
            The name must be between 2 and 36 characters in length.
          </DialogDescription>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleRename}>
          <div>
            <Label htmlFor="boardName">Board Name</Label>
            <Input
              id="boardName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={36}
              required
            />
          </div>

          <DialogFooter className="mt-3">
            {isLoading ? (
              <Button className="w-full md:w-auto select-none" disabled>
                <Loader2 className="animate-spin" />
                Loading..
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full md:w-auto select-none"
                disabled={isLoading}
              >
                Save
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteDeckByIdAction } from "./actions";
import { successToast } from "@/utils/toasts";
import { ResponsiveDialog } from "@/components/responsive-dialog/responsive-dialog";
import { LoadingStateButtonWithText } from "@/components/interactive-buttons/loading-state-button";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DeleteDeckDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deckId: string;
  cb: () => void; // triggers a refresh on deck-list to fetch decks again
}

export function DeleteDeckDialog({
  open,
  setOpen,
  deckId,
  cb,
}: DeleteDeckDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeckDelete = async () => {
    setIsLoading(true);

    // missing deck id
    if (!deckId) {
      setError("Missing Deck Id. Please refresh and try again.");
      setIsLoading(false);
      return;
    }

    // handle api call
    const result = await deleteDeckByIdAction(deckId);

    // on error
    if (result instanceof Error) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    // on success
    setError(null);
    setIsLoading(false);
    successToast(toast, result);
    setOpen(false);
    cb();
  };

  return (
    <ResponsiveDialog
      open={open}
      setOpen={setOpen}
      title="Delete Deck"
      description="Are you sure you want to permanently delete this deck? This action cannot be undone."
      persistOnInteraction
    >
      {/* Display Error */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Delete Actions */}
      <div className="mt-2 flex flex-row items-center justify-between">
        <div className="flex-1">
          <LoadingStateButtonWithText
            isLoading={isLoading}
            type="button"
            variant="destructive"
            text="Delete"
            onClick={handleDeckDelete}
          />
        </div>
        <div className="mx-2"></div>
        <div className="flex-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { successToast } from "@/utils/toasts";
import { renameDeckById } from "../actions";
import { ResponsiveDialog } from "@/components/responsive-dialog/responsive-dialog";
import { LoadingStateButtonWithText } from "@/components/interactive-buttons/loading-state-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface RenameDeckDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deckId: string;
  deckName: string;
  cb: () => Promise<void>; // triggers a refresh on deck-lists
}

export function RenameDeckDialog({
  open,
  setOpen,
  deckId,
  deckName,
  cb,
}: RenameDeckDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(deckName);
  const [error, setError] = useState<string | null>(null);

  const handleRenameDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // missing deckId
    if (!deckId && deckId.trim() != "") {
      setError("DeckId is missing, please close and try again!");
      setIsLoading(false);
      return;
    }

    // validate name
    if (name.trim().length < 1 || name.trim().length > 18) {
      setError(
        "Name is invalid. Please make sure name is between 1 to 18 characters in length.",
      );
      setIsLoading(false);
      return;
    }

    // when name is unchanged prevent api call
    if (deckName === name) {
      setError(
        "The name is unchanged. Please close the dialog to keep the same name.",
      );
      setIsLoading(false);
      return;
    }

    // handle api call
    const result = await renameDeckById(deckId, name.trim());

    // on error
    if (result instanceof Error) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    // on success
    setError(null);
    setIsLoading(false);
    setOpen(false);
    successToast(toast, result);
    cb();
  };

  return (
    <ResponsiveDialog
      open={open}
      setOpen={setOpen}
      title="Rename Deck"
      description="Choose a new name for this deck."
      persistOnInteraction
    >
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRenameDeck}>
        <div className="mt-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            maxLength={18}
            minLength={1}
            required
          />
        </div>
        <div className="mt-3 flex flex-row items-center justify-between">
          <div className="flex-1">
            <LoadingStateButtonWithText
              isLoading={isLoading}
              type="submit"
              variant="default"
              text="Save"
            />
          </div>
          <div className="mx-1"></div>
          <div className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
}

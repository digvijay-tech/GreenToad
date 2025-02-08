"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createDeckAction } from "../actions";
import { successToast } from "@/utils/toasts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";

interface CreateDeckProps {
  workspaceId: string;
  boardId: string;
  cb: () => Promise<void>;
}

export function CreateDeck({ workspaceId, boardId, cb }: CreateDeckProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const removeStateAndClose = () => {
    setError(null);
    setName("");
    setIsLoading(false);
    setOpen(false);
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // validate name length
    if (name.trim().length < 1 || name.trim().length > 26) {
      setError("Name length must be between 1 and 26 characters.");
      setIsLoading(false);
      return;
    }

    const result = await createDeckAction(workspaceId, boardId, name.trim());

    if (result instanceof Error) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    successToast(toast, result);
    removeStateAndClose();
    cb(); // will trigger refetch in `deckList.tsx`
  };

  return (
    <div className="w-[320px]">
      <Button
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
        className="w-full hover:bg-[#f4f4f5]"
      >
        <PlusCircle />
        Add new deck
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onCloseAutoFocus={removeStateAndClose}
        >
          {/* Heading */}
          <DialogHeader>
            <DialogTitle>Create New Deck</DialogTitle>
            <DialogDescription>
              You can only create 25 decks per board!
            </DialogDescription>
          </DialogHeader>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Create Deck Form */}
          <form onSubmit={handleCreateDeck}>
            <div>
              <Label htmlFor="deckNameInput">Enter Deck Name</Label>
              <Input
                type="text"
                id="deckNameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                minLength={1}
                maxLength={26}
                required
              />
            </div>

            <DialogFooter>
              <div className="mt-3">
                {isLoading ? (
                  <Button className="w-full md:w-auto select-none" disabled>
                    <Loader2 className="animate-spin" />
                    Loading..
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full md:w-auto select-none"
                  >
                    Create
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

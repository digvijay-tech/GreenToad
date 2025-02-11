"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUUID } from "validator";
import { createCardAction } from "./actions";
import { errorToast, successToast } from "@/utils/toasts";
import { MAX_CARD_NAME_LEN, MIN_CARD_NAME_LEN } from "@/utils/constants/board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Loader2 } from "lucide-react";

interface CreateCardProps {
  deckId: string;
  cb: () => Promise<void>;
}

export function CreateCard({ deckId, cb }: CreateCardProps) {
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // making sure deckId is valid
    if (!isUUID(deckId)) {
      errorToast(toast, "Something went wrong, please try again later!");
      setIsLoading(false);
      return;
    }

    // validate name input
    if (
      name.trim().length > MAX_CARD_NAME_LEN ||
      name.trim().length < MIN_CARD_NAME_LEN
    ) {
      errorToast(
        toast,
        "Please make sure card name is between 1 to 40 characters in length!",
      );
      setIsLoading(false);
      return;
    }

    // handle api call
    const result = await createCardAction(deckId, name.trim());

    if (result instanceof Error) {
      errorToast(toast, result.message);
      setIsLoading(false);
      return;
    }

    cb(); // triggers card refresh in respective card deck only from parent!
    successToast(toast, result);
    setName("");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleCreateCard}>
      <div className="flex flex-row items-center justify-between">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter card name"
          maxLength={MAX_CARD_NAME_LEN}
          minLength={MIN_CARD_NAME_LEN}
          disabled={isLoading}
          required
        />

        {/* Submit/Loading Button */}
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="ml-1"
            disabled
          >
            <Loader2 className="animate-spin" />
          </Button>
        ) : (
          <Button type="submit" size="icon" variant="outline" className="ml-1">
            <PlusIcon />
          </Button>
        )}
      </div>
    </form>
  );
}

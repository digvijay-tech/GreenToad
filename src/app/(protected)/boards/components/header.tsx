"use client";

import React, { useState, useEffect } from "react";
import { createBoardAction } from "../actions";
import { isValidBoardName } from "@/utils/validators";
import { colors } from "@/utils/constants/colors";
import { ResponsiveDialog } from "@/components/responsive-dialog/responsive-dialog";
import { LoadingStateButtonWithText } from "@/components/interactive-buttons/loading-state-button";
import { HeadingTwo } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircleIcon, AlertCircle } from "lucide-react";
import CircleIcon from "@mui/icons-material/Circle";

{
  /* Page Heading and Create Board Button */
}
export function BoardPageHeader({ cb }: { cb: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [boardName, setBoardName] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // close dialog and remove all states
  const handleDialogClose = () => {
    setError(null);
    setBoardName("");
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // validate name
    if (!isValidBoardName(boardName.trim())) {
      setError(
        "The name must be between 2 and 36 characters in length. Please try again.",
      );
      setIsLoading(false);
      return;
    }

    // when color is missing
    if (!selectedColor) {
      setError("Please select a color!");
      setIsLoading(false);
      return;
    }

    // handle api call
    const result = await createBoardAction(boardName.trim(), selectedColor);

    if (result instanceof Error) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    // notify parent for successful insertion
    cb();
    handleDialogClose();
  };

  // sets random color on load
  useEffect(() => {
    setSelectedColor(colors[Math.floor(Math.random() * colors.length)].code);
  }, []);

  return (
    <div className="flex flex-row justify-between items-center">
      {/* Page Heading */}
      <HeadingTwo text="Boards" />

      {/* Dialog Trigger */}
      <Button onClick={() => setIsOpen(true)} type="button" variant="outline">
        <PlusCircleIcon />
        Create
      </Button>

      {/* Dialog Body */}
      <ResponsiveDialog
        open={isOpen}
        setOpen={setIsOpen}
        title="Create New Board"
        description="You can create upto 10 boards in this workspace."
        persistOnInteraction
      >
        {/* Display Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleCreate}>
          <div className="mt-2">
            <Label htmlFor="nameInput">Enter Board Name</Label>
            <Input
              id="nameInput"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              disabled={isLoading}
              maxLength={36}
              required
            />
          </div>

          <div className="mt-3">
            <Label>Choose Cover</Label>
            <Select
              value={!selectedColor ? "" : selectedColor}
              onValueChange={setSelectedColor}
              disabled={isLoading}
              required
            >
              <SelectTrigger className="w-inherit">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Colors:</SelectLabel>
                  {colors.map((c, i) => (
                    <SelectItem key={i} value={c.code}>
                      <span className="flex items-center">
                        <CircleIcon
                          className="mr-4"
                          style={{ color: c.code }}
                        />
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3">
            <LoadingStateButtonWithText
              isLoading={isLoading}
              type="submit"
              variant="default"
              text="Create"
            />
          </div>
        </form>
      </ResponsiveDialog>
    </div>
  );
}

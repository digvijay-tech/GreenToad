"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { successToast } from "@/utils/toasts";
import { colors } from "@/utils/constants/colors";
import { changeCoverByIdAction } from "./actions";
import { ResponsiveDialog } from "@/components/responsive-dialog/responsive-dialog";
import { LoadingStateButtonWithText } from "@/components/interactive-buttons/loading-state-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CircleIcon from "@mui/icons-material/Circle";

interface ChangeCoverDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  background: string;
  boardId: string;
  workspaceId: string;
}

export function ChangeCoverDialog({
  open,
  setOpen,
  background,
  boardId,
  workspaceId,
}: ChangeCoverDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(background);

  const handleChange = async () => {
    setIsLoading(true);

    if (!selectedColor) {
      setError("Please select a color.");
      setIsLoading(false);
      return;
    }

    // handle api call
    const result = await changeCoverByIdAction(
      boardId,
      workspaceId,
      selectedColor,
    );

    if (result instanceof Error) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(false);

    // show success message and close dialog
    successToast(toast, result);
    setOpen(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      setOpen={setOpen}
      title="Change Board Cover"
      description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      persistOnInteraction
    >
      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Select
        value={selectedColor}
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
                  <CircleIcon className="mr-4" style={{ color: c.code }} />
                  {c.label}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="mt-3">
        <LoadingStateButtonWithText
          isLoading={isLoading}
          text="Save"
          type="button"
          variant="default"
          onClick={handleChange}
        />
      </div>
    </ResponsiveDialog>
  );
}

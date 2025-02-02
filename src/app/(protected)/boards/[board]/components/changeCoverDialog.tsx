"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { successToast } from "@/utils/toasts";
import { colors } from "@/utils/constants/colors";
import { changeCoverById } from "../actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import CircleIcon from "@mui/icons-material/Circle";

export function ChangeCoverDialog({
  open,
  setOpen,
  background,
  boardId,
  workspaceId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  background: string;
  boardId: string;
  workspaceId: string;
}) {
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
    const result = await changeCoverById(boardId, workspaceId, selectedColor);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Change Board Cover</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
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
        </div>

        <DialogFooter className="mt-3">
          {isLoading ? (
            <Button className="w-full md:w-auto select-none" disabled>
              <Loader2 className="animate-spin" />
              Loading..
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full md:w-auto select-none"
              disabled={isLoading}
              onClick={handleChange}
            >
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

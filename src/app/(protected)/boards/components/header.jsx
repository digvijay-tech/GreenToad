"use client";

import { useState, useEffect } from "react";
import { createBoard } from "../actions";
import { isValidBoardName } from "@/utils/validators";
import { colors } from "@/utils/constants/colors";
import { HeadingTwo } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { PlusCircleIcon, Loader2, AlertCircle } from "lucide-react";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";

{
  /* Page Heading and Create Board Button */
}
export function BoardPageHeader({ cb }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [boardName, setBoardName] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // close dialog and remove all states
  const handleDialogClose = () => {
    setError(null);
    setBoardName("");
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // validate name
    if (!isValidBoardName(boardName)) {
      setError(
        "The name must be between 2 and 36 characters in length. Please try again.",
      );
      setIsLoading(false);
      return;
    }

    // handle api call
    try {
      const result = await createBoard(boardName.trim(), selectedColor);

      // any error encountered in creatBoard
      if (result instanceof Error) throw result;
    } catch (e) {
      setError(e.message);
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

      <div>
        <Dialog open={isOpen} onChange={setIsOpen}>
          {/* Dialog Trigger for Open */}
          <Button
            onClick={() => setIsOpen(true)}
            type="button"
            variant="outline"
          >
            <PlusCircleIcon />
            Create
          </Button>

          {/* Actual Dialog Box */}
          <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
            {/* Custom Close Dialog Button */}
            <div className="text-right absolute top-2 right-2">
              <Button size="icon" variant="ghost" onClick={handleDialogClose}>
                <CloseIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Dialog Header with remaining board count */}
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
              <DialogDescription>
                You have created 0 out of 3 boards.
              </DialogDescription>
            </DialogHeader>

            {/* Display Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="border-t pt-3">
              <form onSubmit={handleCreate}>
                <div>
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
                  <Label htmlFor="bgInput">Choose Background</Label>
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
                      Create
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

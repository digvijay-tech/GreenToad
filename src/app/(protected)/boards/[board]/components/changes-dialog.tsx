"use client";

import React from "react";
import { BoardChangesType } from "../actions/types";
import { ResponsiveDialog } from "@/components/responsive-dialog/responsive-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChangesDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  changes: BoardChangesType[];
}

export function ChangesDialog({ open, setOpen, changes }: ChangesDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      setOpen={setOpen}
      title="Changes"
      description="See recent updates and changes made to this board."
    >
      {/* Error Display */}
      {(!changes || changes.length < 1) && (
        <Alert variant="destructive">
          <AlertTitle>No Changes Found!</AlertTitle>
          <AlertDescription>Please try again later.</AlertDescription>
        </Alert>
      )}

      {/* Actual Changes */}
      <ScrollArea className="h-72 w-full">
        <div className="">
          {changes &&
            changes.map((change, i) => (
              <div key={i} className="mt-2 border-b">
                <p className="font-semibold text-sm mt-3">{change.label}</p>
                <p className="text-sm">{change.description}</p>
                <p className="text-xs text-muted-foreground mt-1 mb-1">
                  {change.timestamp}
                </p>
              </div>
            ))}
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
}

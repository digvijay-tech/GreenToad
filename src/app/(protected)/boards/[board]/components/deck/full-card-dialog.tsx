"use client";

import React from "react";
import { CardType } from "../../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FullCardDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  card: CardType;
  refreshCardContent: () => void;
}

export function FullCardDialog({ open, setOpen, card }: FullCardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 m-0 shadow-none border-none rounded-none max-w-screen h-screen overflow-auto flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/*  */}
        <DialogHeader style={{ display: "none" }}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Cover Color Block */}
        <div
          className="lg:h-[120px] h-[80px]"
          style={{ background: card.cover_color }}
        ></div>

        {/* Card Body */}
        <div className="container mx-auto mt-2 px-6 lg:px-0">
          {/* Card Name & Controls */}
          <div className="flex flex-row justify-between items-center">
            <p className="text-lg font-semibold text-left">{card.title}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

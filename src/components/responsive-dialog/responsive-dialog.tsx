"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeOnInteraction?: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ResponsiveDialog({
  open,
  setOpen,
  closeOnInteraction,
  title,
  description,
  children,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  // Rendering Drawer on Mobile Screen
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          onInteractOutside={
            closeOnInteraction ? (e) => e.preventDefault() : undefined
          }
        >
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <div className="mt-3 mb-4 px-2">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Rendering Dialog Box on Desktop Screen
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={
          closeOnInteraction ? (e) => e.preventDefault() : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-3 mb-4 px-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { SvgIconProps } from "@mui/material";
import { Loader2 } from "lucide-react";

type IconType = React.ElementType<SvgIconProps> | LucideIcon;
type ButtonType = "button" | "submit" | "reset";
type ButtonVariant =
  | "link"
  | "secondary"
  | "default"
  | "destructive"
  | "outline"
  | "ghost";

interface LoadingStateButtonWithTextProps {
  isLoading: boolean;
  icon?: IconType;
  type: ButtonType;
  variant: ButtonVariant;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (...args: any[]) => void; // accepts a function of any kind
}

export function LoadingStateButtonWithText({
  isLoading,
  icon: Icon, // capitalized to be used as a component
  type,
  variant,
  text,
  onClick,
}: LoadingStateButtonWithTextProps) {
  return (
    <div className="text-left">
      {isLoading ? (
        <Button className="w-full py-5" disabled>
          <Loader2 className="animate-spin !size-5" />
          <p className="text-md">Loading..</p>
        </Button>
      ) : (
        <Button
          type={type}
          variant={variant}
          onClick={onClick}
          className="w-full py-5"
        >
          {Icon && <Icon className="!size-5" />}
          <p className="text-md">{text}</p>
        </Button>
      )}
    </div>
  );
}

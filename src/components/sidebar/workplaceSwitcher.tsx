"use client";

import { useState } from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

export function WorksplaceSwitcher() {
  const [selectedWorkplace, setSelectedWorkplace] = useState("Personal");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Workplace</span>

                {/* Truncates the extra text */}
                <span>
                  {selectedWorkplace &&
                  typeof selectedWorkplace === "string" &&
                  selectedWorkplace.length > 20
                    ? selectedWorkplace.slice(0, 20) + ".."
                    : selectedWorkplace}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {["Personal", "Google LLC", "University of East London"].map(
              (wp, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => setSelectedWorkplace(wp)}
                >
                  {wp}{" "}
                  {wp === selectedWorkplace && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

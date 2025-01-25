/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useUserProfileContext } from "@/contexts/profile/index";
import { UserProfileType, WorkspaceType } from "@/contexts/profile/types";
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
  const { profile, getProfile, workspaces, getWorkspaces } =
    useUserProfileContext();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceType | null>(null);
  const [availableWorkspaces, setAvailableWorkspaces] = useState<
    WorkspaceType[] | null
  >(null);

  // on load and watch changes in profile and workspaces
  useEffect(() => {
    (async function () {
      await getProfile();
      await getWorkspaces();
    })();

    setUserProfile(profile);
    setAvailableWorkspaces(workspaces);

    // find and set the current workspace set by user
    if (workspaces) {
      workspaces.forEach((ws: WorkspaceType) => {
        if (profile.default_workspace_id === ws.id) {
          setSelectedWorkspace(ws);
        }
      });
    }
  }, [profile, getProfile, workspaces, getWorkspaces]);

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
                  {selectedWorkspace &&
                  typeof selectedWorkspace.name === "string" &&
                  selectedWorkspace.name.length > 20
                    ? selectedWorkspace.name.slice(0, 20) + ".."
                    : selectedWorkspace?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {userProfile &&
              availableWorkspaces &&
              availableWorkspaces.map((wp) => (
                <DropdownMenuItem
                  key={wp.id}
                  onSelect={() => setSelectedWorkspace(wp)}
                >
                  {wp.name}{" "}
                  {wp.id === userProfile.default_workspace_id && (
                    <Check className="ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileContext } from "@/contexts/profile/index";
import { UserProfileType, WorkspaceType } from "@/contexts/profile/types";
import { switchWorkspaceAction } from "./actions";
import { errorToast } from "@/utils/toasts";
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
  const { toast } = useToast();
  const {
    profile,
    getProfile,
    workspaces,
    getWorkspaces,
    removeUserProfileContext,
  } = useUserProfileContext();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceType | null>(null);
  const [availableWorkspaces, setAvailableWorkspaces] = useState<
    WorkspaceType[] | null
  >(null);

  const handleWorkspaceSwitch = async (wsId: string) => {
    try {
      const result = await switchWorkspaceAction(wsId);

      if (result instanceof Error) {
        throw result;
      }

      removeUserProfileContext();
    } catch (e) {
      if (e instanceof Error) {
        errorToast(toast, e.message);
      } else {
        console.log(e);
        errorToast(toast, "Something went wrong!");
      }
    }
  };

  // on load and watch changes in profile and workspaces
  useEffect(() => {
    (async function () {
      await getProfile();
      await getWorkspaces();
    })();

    setUserProfile(profile);
    setAvailableWorkspaces(workspaces);

    // find and set the current workspace set by user
    if (workspaces && profile) {
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
                  onSelect={() => handleWorkspaceSwitch(wp.id)}
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

// User Profile Section On The Sidebar Footer
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { useUserProfileContext } from "@/contexts/profile/index";
import { LoadingOverlay } from "@/components/overlays/loadingOverlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User2,
} from "lucide-react";

export function SidebarUser({ name, email, imageUrl }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { removeUser } = useUserProfileContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    // start loading
    setIsLoading(true);

    // remove user state from User Profile context
    removeUser();

    // supabase signout action
    await signOutAction();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={imageUrl} alt="@user-profile" />
                <AvatarFallback className="rounded-lg">
                  <User2 />
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={imageUrl} alt="@user" />
                  <AvatarFallback className="rounded-lg">
                    <User2 />
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled
                className={`${pathname === "/getPro" && "bg-[#f2f2f2]"} cursor-pointer`}
              >
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/account">
                <DropdownMenuItem
                  className={`${pathname === "/account" && "bg-[#f2f2f2]"} cursor-pointer`}
                >
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
              {/* <Link href="#!"> */}
              <DropdownMenuItem
                disabled
                className={`${pathname === "/billing" && "bg-[#f2f2f2]"} cursor-pointer`}
              >
                <CreditCard />
                Billing
              </DropdownMenuItem>
              {/* </Link> */}
              <Link href="/notifications">
                <DropdownMenuItem
                  className={`${pathname === "/notifications" && "bg-[#f2f2f2]"} cursor-pointer`}
                >
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogOut}
              className="text-white bg-[#e74c3c] focus:text-white focus:bg-[#c0392b] cursor-pointer"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Triggers After User Click Logout Button */}
      {isLoading && <LoadingOverlay loadingText="Signing Out.. Please Wait!" />}
    </SidebarMenu>
  );
}

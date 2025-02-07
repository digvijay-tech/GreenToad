// Customization of Side Bar From ShadCN/ui
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserProfileContext } from "@/contexts/profile/index";
import { WorksplaceSwitcher } from "@/components/sidebar/workplace-switcher";
import { SidebarUser } from "@/components/sidebar/sidebar-user";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimerIcon from "@mui/icons-material/Timer";
import MapIcon from "@mui/icons-material/Map";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Sidebar Links
const links = [
  { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
  { label: "Boards", path: "/boards", icon: ViewKanbanIcon },
  { label: "Todos", path: "/todos", icon: ListAltIcon },
  { label: "Calendar", path: "/calendar", icon: CalendarMonthIcon },
  { label: "Pomodoro", path: "/pomodoro", icon: TimerIcon },
  { label: "Roadmaps", path: "/roadmaps", icon: MapIcon },
  { label: "Settings", path: "/settings", icon: SettingsIcon },
  // add as needed
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, getUser } = useUserProfileContext();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  useEffect(() => {
    // when user is present in UserProfile Context
    if (user) {
      setEmail(user.email);
      setName(user.user_metadata.full_name);
      setPictureUrl(user.user_metadata.picture);

      return;
    }

    // when user is not in UserProfile Context
    (async function () {
      const profile = await getUser();

      if (profile) {
        setEmail(profile.email);
        setName(profile.user_metadata.full_name);
        setPictureUrl(profile.user_metadata.picture);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* Fixed Header Section */}
      <SidebarHeader>
        <WorksplaceSwitcher />
      </SidebarHeader>

      {/* Scrollable Content Section */}
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>Test Label</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link, index) => (
                <SidebarMenuItem key={index}>
                  <Link href={link.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === link.path}
                    >
                      <span>
                        <link.icon />
                        {link.label}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Fixed Footer Section with Menu */}
      <SidebarFooter>
        {email && (
          <SidebarUser name={name} email={email} imageUrl={pictureUrl} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

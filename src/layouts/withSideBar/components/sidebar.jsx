// Customization of Side Bar From ShadCN/ui 
"use client";

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
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAccountContext } from "@/contexts/account/index";
import { getUserProfile } from "../actions/getUserProfile";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimerIcon from '@mui/icons-material/Timer';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';


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
    const { account, getUser } = useAccountContext();
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(null);
    const [workspace, setWorkspace] = useState("Default");

    useEffect(() => {
        console.log("1. Effect Fired!");
        (async function() {
            const profile = await getUserProfile();

            if (profile) {
                setEmail(profile.email);
                setName(profile.user_metadata.full_name);
                setPictureUrl(profile.user_metadata.picture);
            }
        })();
    }, []);

    useEffect(() => {
        console.log("2. Effect Fired!");
        getUser();
    }, []);

    useEffect(() => {
        console.log("3. Effect Fired!");
        console.log(account);
    }, [account]);

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <p className="text-md text-muted-foreground">
                                        Workspace: {workspace}
                                    </p>
                                        
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuRadioGroup value={workspace} onValueChange={setWorkspace}>
                                    <DropdownMenuRadioItem value="University">
                                        University
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Default">
                                        Default
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Google LLC">
                                        Google LLC
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <Separator className="mt-2" />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map((item, index) => (
                                <SidebarMenuItem key={index} className="rounded-sm hover:bg-[#f3f3f3]">
                                    <SidebarMenuButton asChild>
                                        <Link href={item.path}>
                                            <item.icon />
                                            { item.label }
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <Separator />

            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/account">
                                    <div className="w-full py-2 flex flex-row items-center rounded-md hover:bg-[#f3f3f3]">
                                        {/* User Avatar */}
                                        <Avatar>
                                            <AvatarImage src={pictureUrl} alt="@greentoad" />
                                            <AvatarFallback>
                                                <PersonIcon />
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Name and Email */}
                                        <div className="ml-2 ">
                                            {name && (
                                                <p className="text-sm font-medium leading-none">
                                                    { name.slice(0, 27) }
                                                </p>
                                            )}

                                            {email && (
                                                <p className="text-xs font-medium leading text-muted-foreground">
                                                    { email.slice(0, 27) }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}

// Global Navigation Bar (Post Login)
"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';


export function Navbar() {
    return (
        <div className="sticky top-0 bg-[#ffffff] border-b">
            <div className="flex flex-row justify-between items-center">
                {/* Logo and Sidebar Trigger */}
                <div className="flex flex-row items-center justify-evenly">
                    <Button variant="outline" size="icon" className="ml-5 mr-3">
                        <ArrowBackIosIcon />
                    </Button>

                    <div className="h-5">
                        <Separator orientation="vertical" />
                    </div>
                    
                    <Link href="/">
                        <Avatar className="w-[50px] h-[50px]">
                            <AvatarImage
                                className="w-full h-full"
                                src="/greentoad.png"
                                alt="@GreenToad"
                            />
                            <AvatarFallback className="text-xl">GT</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>

                {/* User Account and Notification Trigger */}
                <div className="flex-1 flex flex-row items-center justify-end">
                    <div className="border p-2 rounded-full hover:bg-[#f3f3f3] text-[#2d3436] cursor-pointer">
                        <NotificationsIcon fontSize="medium" />
                    </div>

                    <Avatar className="w-[43px] h-[43px] cursor-pointer border mr-5 ml-3">
                        <AvatarImage
                            className="w-full h-full"
                            src="/greentoa.png"
                            alt="@GreenToad"
                        />
                        <AvatarFallback className="text-xl text-[#2d3436]">
                            <PersonIcon fontSize="medium" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}

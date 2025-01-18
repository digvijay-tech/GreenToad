// Side Bar Layout for Post Login
"use client";

import { useState } from "react";
import { signOutAction } from "@/actions";
import { LoadingOverlay } from "@/components/overlays/loadingOverlay";
import { AppSidebar } from "./components/sidebar";
import { HeadingTwo } from "@/components/typography/headings";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import InboxIcon from '@mui/icons-material/Inbox';
import LogoutIcon from '@mui/icons-material/Logout';


export default function SideBarLayout({ children, pageHeading }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogOut = async () => {
    // start loading
    setIsLoading(true);
    
    // supabase signout action
    await signOutAction();
  }

    return (
      <main>
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            <div className="sticky top-0 right-0 left-0 border-b bg-[#ffffff]">
              <div className="flex flex-row items-center justify-between py-2">
                <div className="flex flex-row items-center justify-between">
                  <SidebarTrigger size="icon" />

                  <div className="h-5">
                    <Separator orientation="vertical" />
                  </div>

                  <div className="ml-3">
                    <HeadingTwo text={pageHeading} />
                  </div>
                </div>

                <div className="flex flex-row items-center">
                  <div className="rounded-sm p-1 text-2xl  hover:bg-[#f3f3f3] text-[#2d3436] cursor-pointer">
                    <InboxIcon fontSize="inherit" />
                  </div>

                  <div className="h-5 ml-2 mr-3">
                    <Separator orientation="vertical" />
                  </div>

                  <div
                    className="p-1 mr-3 text-2xl hover:bg-[#f3f3f3] text-[#2d3436] cursor-pointer"
                    onClick={handleLogOut}
                  >
                    <LogoutIcon fontSize="inherit" />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 container mx-auto">
              { children }
            </div>
          </div>
        </SidebarProvider>
        
        {/* Triggers After User Click Logout Button */}
        {isLoading && <LoadingOverlay loadingText="Signing Out.. Please Wait!" />}
      </main>
    );
}


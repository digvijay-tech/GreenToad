// Custom Layout with Sidebar (Only For Protected Routes)
"use client";

import { AppSidebar } from "@/components/sidebar/sidebar";
import { HeadingThree } from "@/components/typography/headings";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function SideBarLayout({ children }) {
  return (
    <SidebarProvider>
      {/* Sidebar Component */}
      <AppSidebar />

      {/* Main Content Section */}
      <SidebarInset>
        <header className="flex fixed z-[5] top-0 w-full bg-[#ffffff] h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="ml-1" />

          <div className="h-6">
            <Separator orientation="vertical" />
          </div>

          {/* Will be replaced with actual app logo later */}
          <HeadingThree text="Index137" />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

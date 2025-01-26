"use client";

import { HeadingFour } from "@/components/typography/headings";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LockIcon from "@mui/icons-material/Lock";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PeopleIcon from "@mui/icons-material/People";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import DeleteIcon from "@mui/icons-material/Delete";

export function BoardHeader({ boardName }: { boardName: string }) {
  return (
    <div className="">
      <div className="flex flex-row items-center justify-between">
        <HeadingFour text={`Name: ${boardName}`} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <BorderColorIcon className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <ColorLensIcon className="h-4 w-4" />
              Change Background
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="cursor-pointer">
              <LockIcon className="h-4 w-4" />
              Close Board
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="cursor-pointer">
              <PeopleIcon className="h-4 w-4" />
              Members
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BrowseGalleryIcon className="h-4 w-4" />
              View Changes
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer text-white focus:text-white bg-red-500 focus:bg-red-500 focus:opacity-[.93]">
              <DeleteIcon className="h-4 w-4" />
              Delete Board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator />
    </div>
  );
}

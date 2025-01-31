"use client";

import { useToast } from "@/hooks/use-toast";
import { BoardType } from "../actions/types";
import { toggleIsClosedOption } from "../actions";
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
import NoEncryptionGmailerrorredIcon from "@mui/icons-material/NoEncryptionGmailerrorred";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PeopleIcon from "@mui/icons-material/People";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import DeleteIcon from "@mui/icons-material/Delete";

// Displays error messages in a toast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorToast = (toast: any, message: string) => {
  toast({
    title: "Error",
    description: message,
    style: {
      color: "#e74c3c",
      textAlign: "justify",
    },
  });
};

// Displays success messages in a toast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const successToast = (toast: any, message: string) => {
  toast({
    title: "Success",
    description: message,
    style: {
      color: "#2ecc71",
      textAlign: "justify",
    },
  });
};

export function BoardHeader({
  board,
  workspaceId,
  cb,
}: {
  board: BoardType;
  workspaceId: string;
  cb: () => void;
}) {
  const { toast } = useToast();

  // toggle isClosed option
  const handleIsCloseToggle = async () => {
    const result = await toggleIsClosedOption(
      board.is_closed,
      workspaceId,
      board.id,
    );

    if (result instanceof Error) {
      errorToast(toast, result.message);
      return;
    }

    // update successful
    successToast(toast, result);
    cb(); // will trigger a refresh on parent
  };

  return (
    <div className="">
      <div className="flex flex-row items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight select-none">
          {board.name}{" "}
          {board.is_closed && (
            <sup className="font-normal text-xs text-gray-500">
              (<span className="text-blue-400">Closed</span>)
            </sup>
          )}
        </h4>

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
            <DropdownMenuItem
              onClick={handleIsCloseToggle}
              className="cursor-pointer"
            >
              {board.is_closed && (
                <NoEncryptionGmailerrorredIcon className="h-4 w-4" />
              )}
              {!board.is_closed && <LockIcon className="h-4 w-4" />}
              {board.is_closed ? "Open Board" : "Close Board"}
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

            <DropdownMenuItem
              disabled={!board.is_closed}
              className="cursor-pointer text-white focus:text-white bg-red-500 focus:bg-red-500 focus:opacity-[.93]"
            >
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

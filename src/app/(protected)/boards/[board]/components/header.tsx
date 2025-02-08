"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BoardChangesType, BoardType } from "../actions/types";
import { toggleIsClosedOptionAction } from "../actions";
import { RenameDialog } from "./rename-dialog";
import { DeleteDialog } from "./delete-dialog";
import { ChangesDialog } from "./changes-dialog";
import { ChangeCoverDialog } from "./change-cover-dialog";
import { successToast, errorToast } from "@/utils/toasts";
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
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isRenameOpen, setIsRenameOpen] = useState<boolean>(false);
  const [isChangeCoverOpen, setIsChangeCoverOpen] = useState<boolean>(false);
  const [isChangesOpen, setIsChangesOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  // toggle isClosed option
  const handleIsCloseToggle = async () => {
    const result = await toggleIsClosedOptionAction(
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
    <div>
      {/* Rename Board Dialog */}
      <RenameDialog
        boardId={board.id}
        workspaceId={workspaceId}
        boardName={board.name}
        open={isRenameOpen}
        setOpen={setIsRenameOpen}
        cb={cb}
      />

      {/* Change Cover Dialog */}
      <ChangeCoverDialog
        open={isChangeCoverOpen}
        setOpen={setIsChangeCoverOpen}
        background={board.background}
        boardId={board.id}
        workspaceId={workspaceId}
      />

      {/* Board Changes Dialog */}
      <ChangesDialog
        open={isChangesOpen}
        setOpen={setIsChangesOpen}
        changes={board.changes as unknown as BoardChangesType[]}
      />

      {/* Delete Board Dialog */}
      <DeleteDialog
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        boardId={board.id}
        workspaceId={workspaceId}
      />

      <div className="flex flex-row items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight select-none">
          {board.name}{" "}
          {board.is_closed && (
            <sup className="font-normal text-xs text-gray-500">
              (<span className="text-blue-400">Closed</span>)
            </sup>
          )}
        </h4>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => setIsRenameOpen(true)}
              className="cursor-pointer"
            >
              <BorderColorIcon className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsChangeCoverOpen(true)}
              className="cursor-pointer"
            >
              <ColorLensIcon className="h-4 w-4" />
              Change Cover
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
            <DropdownMenuItem
              onClick={() => setIsChangesOpen(true)}
              className="cursor-pointer"
            >
              <BrowseGalleryIcon className="h-4 w-4" />
              Changes
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={!board.is_closed}
              className="cursor-pointer text-white focus:text-white bg-red-500 focus:bg-red-500 focus:opacity-[.93]"
              onClick={() => setIsDeleteOpen(true)}
            >
              <DeleteIcon className="h-4 w-4" />
              Delete Board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

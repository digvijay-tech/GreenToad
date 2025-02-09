"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardDeckType } from "../actions/types";
import { DeleteDeckDialog } from "./delete-deck-dialog";
import { RenameDeckDialog } from "./rename-deck-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, PlusIcon } from "lucide-react";

interface DeckProps {
  deck: BoardDeckType;
  cb: () => Promise<void>; // triggers a refresh on deck-list to fetch decks again
}

// Deck Component will work as Sortable Item
export function Deck({ deck, cb }: DeckProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isRenameOpen, setIsRenameOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: deck.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div>
      {/* Dialogs */}
      <DeleteDeckDialog
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        deckId={deck.id}
        cb={cb}
      />

      <RenameDeckDialog
        open={isRenameOpen}
        setOpen={setIsRenameOpen}
        deckId={deck.id}
        deckName={deck.name}
        cb={cb}
      />

      <div
        className="w-[320px] h-full rounded-lg shadow"
        ref={setNodeRef}
        style={style}
      >
        <div className="h-full bg-[#f1f2f6] rounded-t-lg flex flex-col">
          {/* Fixed Deck Header */}
          <div className="px-2">
            {/* DND-KIT Draggable Component Drag Handle and Deck Name Display & Options */}
            <div {...attributes} {...listeners} className="cursor-grab">
              <div className="mt-2 flex flex-row justify-between items-center border-b">
                <p className="text-md font-semibold truncate mr-1">
                  {deck.name}
                </p>

                {/* Dropdown Menu Panel */}
                <DropdownMenu
                  open={isMenuOpen}
                  onOpenChange={setIsMenuOpen}
                  modal={false}
                >
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="link">
                      <MoreVertical className="h-3 w-3 text-gray-950" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-46">
                    <DropdownMenuItem
                      onClick={() => setIsRenameOpen(true)}
                      className="cursor-pointer"
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteOpen(true)}
                      className="cursor-pointer"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Deck Body (Scrollable) */}
          <ScrollArea className="h-full">
            <div className="flex-3">
              {Array.from({ length: 20 }).map((v, i) => (
                <div key={i} className="px-2 mt-2 select-none cursor-pointer">
                  <div className="shadow-xs bg-white border rounded-lg flex justify-start items-stretch">
                    {/* Left-Side Card Color  */}
                    <div className="w-3 bg-[#ecf0f1] rounded-tl-lg rounded-bl-lg"></div>

                    {/* Right-Side Card Content */}
                    <div className="w-full px-2 py-2 rounded-tr-lg rounded-br-lg">
                      {/* Card Name */}
                      <div className="mt-1">
                        <p className="text-xs font-semibold leading-none line-clamp-2">
                          Lorem ipsum dolor sit amet, consectetur adipisicing.
                        </p>
                      </div>

                      {/* Labels */}
                      <div className="mb-1 mt-3">
                        {["One", "Two"].map((label, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="mr-1 py-[0px]"
                          >
                            <p className="text-[10px]">{label}</p>
                          </Badge>
                        ))}
                      </div>

                      {/* Card Icons */}
                      <div className="mt-2 flex">
                        {Array.from({ length: 4 }).map((v, i) => (
                          <PlusIcon
                            key={i}
                            className="h-4 mr-1 text-muted-foreground"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Fixed Deck Footer */}
          <div className="p-2 bg-white border-b">
            {/* Create Card Form */}
            <form>
              <div className="flex flex-row items-center justify-between">
                <Input type="text" placeholder="Enter card name" required />
                <Button
                  type="submit"
                  size="icon"
                  variant="outline"
                  className="ml-1"
                >
                  <PlusIcon />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

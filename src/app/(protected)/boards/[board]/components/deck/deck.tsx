"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardDeckType } from "../../../types";
import { DeleteDeckDialog } from "./delete-deck-dialog";
import { RenameDeckDialog } from "./rename-deck-dialog";
import { Card } from "./card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
                <Card
                  key={i}
                  card={{
                    id: "dwsnfgjld",
                    user_id: "sdvjb",
                    deck_id: "adsfvbjld",
                    title: "dvjlbsjdv",
                    description: "svjbcvjsbvsjbvlsn",
                    cover_color: "#27ae60",
                    start_date: null,
                    due_date: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }}
                  cb={cb}
                />
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

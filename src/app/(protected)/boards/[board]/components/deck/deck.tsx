"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorToast } from "@/utils/toasts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardDeckType, CardType } from "../../../types";
import { fetchCardsByDeckId } from "./actions";
import { DeleteDeckDialog } from "./delete-deck-dialog";
import { RenameDeckDialog } from "./rename-deck-dialog";
import { Card } from "./card";
import { CreateCard } from "./create-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical } from "lucide-react";

interface DeckProps {
  deck: BoardDeckType;
  cb: () => Promise<void>; // triggers a refresh on deck-list to fetch decks again
}

// Deck Component will work as Sortable Item
export function Deck({ deck, cb }: DeckProps) {
  const { toast } = useToast();
  const [cards, setCards] = useState<CardType[] | null>(null);
  const [isCardsLoading, setIsCardsLoading] = useState<boolean>(false);
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

  // fetch and load cards
  const fetchAndLoadCards = async () => {
    setIsCardsLoading(true);
    const result = await fetchCardsByDeckId(deck.id);

    // on error
    if (result instanceof Error) {
      errorToast(toast, result.message);
      setIsCardsLoading(false);
      return;
    }

    // on null, meaning supabase returned an emtpy array
    if (result === null) {
      setCards(null);
      setIsCardsLoading(false);
      return;
    }

    // on success
    setCards(result);
    setIsCardsLoading(false);
  };

  // on load
  useEffect(() => {
    fetchAndLoadCards();
  }, []);

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

          {isCardsLoading ? (
            <div className="h-full flex flex-col justify-center items-center">
              {/* Skeleton Screen for loading Cards/list */}
              <div className="">
                <Loader2 className="animate-spin" />
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              {/* Deck Body (Scrollable) */}
              <div className="flex-3">
                {cards &&
                  cards.map((card) => (
                    <Card key={card.id} card={card} cb={fetchAndLoadCards} />
                  ))}
              </div>
            </ScrollArea>
          )}

          {/* Fixed Deck Footer */}
          <div className="p-2 bg-white border-b">
            {/* Create Card Form */}
            <CreateCard deckId={deck.id} cb={fetchAndLoadCards} />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Deck } from "./deck";
import { CreateDeck } from "./createDeck";
import { fetchDecksByBoardId, updateDeckOrder } from "../actions";
import { BoardDeckType } from "../actions/types";
import { errorToast } from "@/utils/toasts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

interface DeckListProps {
  workspaceId: string;
  boardId: string;
}

export function DeckList({ workspaceId, boardId }: DeckListProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [decks, setDecks] = useState<BoardDeckType[]>([]);
  const updatedDecksRef = useRef<BoardDeckType[]>([]); // tracks updated decks
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor),
  );

  // DnD-Kit Drag handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (e: { active: any; over: any }) => {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    setDecks((prevDecks) => {
      if (!prevDecks) return prevDecks;

      // find old index and new index based on `order`
      const oldIndex = prevDecks.findIndex((deck) => deck.id === active.id);
      const newIndex = prevDecks.findIndex((deck) => deck.id === over.id);

      // reorder array
      const newDecks = arrayMove(prevDecks, oldIndex, newIndex);

      // reassign `order` values to reflect the new order
      const updatedDecks = newDecks.map((deck, i) => ({
        ...deck,
        order: i + 1, // assigning new order
      }));

      // Store the updated deck order in the ref (not in state)
      updatedDecksRef.current = updatedDecks;

      return updatedDecks;
    });
  };

  // reusable function fetch and refresh the decks on state change
  const fetchAndLoadDecks = async () => {
    setIsLoading(true);

    const result = await fetchDecksByBoardId(boardId, workspaceId);

    if (result instanceof Error) {
      errorToast(toast, result.message);
      setIsLoading(false);
      return;
    }

    setDecks(result);
    setIsLoading(false);
  };

  // on changes in deck order
  useEffect(() => {
    (async function () {
      if (updatedDecksRef.current.length > 0) {
        const result = await updateDeckOrder(updatedDecksRef.current);

        if (result instanceof Error) {
          errorToast(toast, "Failed to update deck order.");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decks]);

  // on load
  useEffect(() => {
    (async function () {
      await fetchAndLoadDecks();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, workspaceId]);

  if (isLoading) {
    return (
      <div className="">
        <p className="">Loading.. Deck List</p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <ScrollArea className="h-full flex-1 w-1">
        <div className="flex h-[calc(100vh-118px)] space-x-3 mx-2">
          {/* SORTABLE DECKS SECTION */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={decks ? decks.map((deck) => deck.id) : []}
              strategy={horizontalListSortingStrategy}
            >
              {decks && decks.map((deck) => <Deck key={deck.id} {...deck} />)}
            </SortableContext>
          </DndContext>

          {/* CREATE NEW DECK SECTION */}
          <CreateDeck
            workspaceId={workspaceId}
            boardId={boardId}
            cb={fetchAndLoadDecks}
          />
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

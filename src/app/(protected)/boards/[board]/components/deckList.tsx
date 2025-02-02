"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Deck } from "./deck";
import { CreateDeck } from "./createDeck";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DeckListProps {
  workspaceId: string;
  boardId: string;
}

export function DeckList({ workspaceId, boardId }: DeckListProps) {
  const [isClient, setIsClient] = useState(false);
  const [decks, setDecks] = useState<number[]>([1, 2]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (e: { active: any; over: any }) => {
    const { active, over } = e;

    if (active.id !== over.id) {
      setDecks((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full flex">
        <ScrollArea className="h-full flex-1 w-1 border border-red-400">
          <div className="flex h-[calc(100vh-118px)] space-x-3 mx-2">
            {decks.map((id) => (
              <div key={id} className="w-[320px] h-full border">
                <p>Hello GreenToad! {id}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
              items={decks}
              strategy={horizontalListSortingStrategy}
            >
              {decks.map((id) => (
                <Deck key={id} sortableId={id} />
              ))}
            </SortableContext>

            <ScrollBar orientation="horizontal" />
          </DndContext>

          {/* CREATE NEW DECK SECTION */}
          <CreateDeck workspaceId={workspaceId} boardId={boardId} />
        </div>
      </ScrollArea>
    </div>
  );
}

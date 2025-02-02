"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardDeckType } from "../actions/types";

// Deck Component will work as Sortable Item
export function Deck(deck: BoardDeckType) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: deck.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      className="w-[320px] h-full border"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p>{deck.name}</p>
    </div>
  );
}

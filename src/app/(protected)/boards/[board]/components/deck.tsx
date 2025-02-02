"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Deck Component will work as Sortable Item
export function Deck({ sortableId }: { sortableId: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sortableId });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      className="w-[320px] h-full border"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p>Hello GreenToad! {sortableId}</p>
    </div>
  );
}

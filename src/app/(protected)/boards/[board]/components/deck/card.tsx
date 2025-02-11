"use client";

import { CardType } from "../../../types";
import { Badge } from "@/components/ui/badge";
import { Clock10Icon, AlignJustify } from "lucide-react";

interface CardTypeProps {
  card: CardType;
  cb: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Card({ card, cb }: CardTypeProps) {
  return (
    <div className="px-2 mt-2 select-none cursor-pointer">
      <div className="shadow-xs bg-white border rounded-lg flex justify-start items-stretch">
        {/* Left-Side Card Color  */}
        <div
          className="w-3 rounded-tl-lg rounded-bl-lg"
          style={{ background: card.cover_color }}
        ></div>

        {/* Right-Side Card Content */}
        <div className="w-full px-2 py-2 rounded-tr-lg rounded-br-lg">
          {/* Card Name */}
          <div className="mt-1">
            <p className="text-xs font-semibold leading-none line-clamp-2">
              {card.title}
            </p>
          </div>

          {/* Labels - will work on it later! */}
          <div className="mb-1 mt-3">
            {["One", "Two"].map((label, i) => (
              <Badge key={i} variant="secondary" className="mr-1 py-[0px]">
                <p className="text-[10px]">{label}</p>
              </Badge>
            ))}
          </div>

          {/* Card Icons */}
          <div className="mt-2 flex">
            {(card.start_date || card.due_date) && (
              <Clock10Icon className="h-4 mr-1 text-muted-foreground" />
            )}

            {card.description && (
              <AlignJustify className="h-4 mr-1 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { BoardHeader } from "./header";

export function BoardPageWrapper({ boardId }: { boardId: string }) {
  return (
    <div>
      {/* Board Heading and Controls */}
      <BoardHeader boardName={boardId} />
    </div>
  );
}

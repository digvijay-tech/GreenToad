// Don't make it client
// Use `BoardPageWrapper` for everything

import { BoardPageWrapper } from "./components/wrapper";

interface BoardProps {
  params: {
    board: string;
  };
}

export default async function Board({ params }: BoardProps) {
  const boardId = (await params).board;

  return (
    <div className="h-full mt-[60px] p-4">
      <BoardPageWrapper boardId={boardId} />
    </div>
  );
}

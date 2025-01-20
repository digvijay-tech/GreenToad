import { BoardPageHeader } from "./components/header";
import { BoardsList } from "./components/boardlist";

export default function Boards() {
  return (
    <div className="mt-[60px] container mx-auto">
      {/* Page Heading and Create Board Button */}
      <BoardPageHeader />

      {/* Grid of Boards and Controls */}
      <div className="mt-5">
        <BoardsList />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useUserProfileContext } from "@/contexts/profile/index";
import { fetchBoards } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { BoardPageHeader } from "./components/header";
import { BoardsList } from "./components/boardlist";
import { errorToast } from "@/utils/toasts";

export default function Boards() {
  const { toast } = useToast();
  const { workspaces } = useUserProfileContext();
  const [boards, setBoards] = useState(null);

  // handle callback from BoardPageHeader component when new board is created
  // and fetch new state
  const handleCreateCallback = () => {
    (async function () {
      const result = await fetchBoards();

      if (result instanceof Error) {
        return errorToast(toast, result.message);
      }

      setBoards(result);
    })();
  };

  useEffect(() => {
    (async function () {
      const result = await fetchBoards();

      if (result instanceof Error) {
        return errorToast(toast, result.message);
      }

      setBoards(result);
    })();
  }, [workspaces]);

  return (
    <div className="mt-[60px] container mx-auto p-4">
      {/* Page Heading and Create Board Button */}
      <BoardPageHeader cb={handleCreateCallback} />

      {/* Grid of Boards and Controls */}
      <div className="mt-5">
        <BoardsList data={boards} />
      </div>
    </div>
  );
}

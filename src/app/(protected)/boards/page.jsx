"use client";

import { useState, useEffect } from "react";
import { fetchBoards } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { BoardPageHeader } from "./components/header";
import { BoardsList } from "./components/boardlist";


// Displays error messages in a toast
const errorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    style: {
      color: "#e74c3c",
      textAlign: "justify",
    },
  });
};

export default function Boards() {
  const { toast } = useToast();
  const [boards, setBoards] = useState(null);

  // handle callback from BoardPageHeader component when new board is created
  // and fetch new state
  const handleCreateCallback = () => {
    (async function() {
      const result = await fetchBoards();

      if (result instanceof Error) {
        return errorToast(toast, result.message);
      }

      setBoards(result);
    })();
  }

  useEffect(() => {
    (async function() {
      const result = await fetchBoards();

      if (result instanceof Error) {
        return errorToast(toast, result.message);
      }

      setBoards(result);
    })();
  }, []);

  return (
    <div className="mt-[60px] container mx-auto">
      {/* Page Heading and Create Board Button */}
      <BoardPageHeader cb={handleCreateCallback} />

      {/* Grid of Boards and Controls */}
      <div className="mt-5">
        <BoardsList data={boards} />
      </div>
    </div>
  );
}

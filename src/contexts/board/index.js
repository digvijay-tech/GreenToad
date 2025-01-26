// Individual Board Context
"use client";

import { createContext, useState, useContext } from "react";

const BoardContext = createContext();

export function BoardProvider({ children }) {
  const [board, setBoard] = useState(null);

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

// creates context hook
export const useBoardContext = () => {
  useContext(BoardContext);
};

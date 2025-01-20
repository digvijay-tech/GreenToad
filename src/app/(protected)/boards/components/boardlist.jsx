"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const dummyData = [
  { id: 1, name: "Computer Science", background: "#2980b9" },
  { id: 2, name: "Social Studies Thesis", background: "#9b59b6" },
  { id: 3, name: "Classical Physics", background: "#34495e" },
  { id: 4, name: "Quantum Physics", background: "#f39c12" },
  { id: 5, name: "Astro Gym Website Project", background: "#d35400" },
  {
    id: 6,
    name: "CN6000 Module Research Work and Report",
    background: "#A3CB38",
  },
  { id: 7, name: "CN6003 AI Submission", background: "#1B1464" },
];

export function BoardsList() {
  const [searchInput, setSearchInput] = useState("");
  const [boards, setBoards] = useState(null);
  const [matchedBoards, setMatchedBoards] = useState([]);

  // function to filter the matched keywords based on the search input
  const getMatchedKeywords = (input) => {
    const filteredKeywords = boards.filter((b) =>
      b.name.toLowerCase().includes(input.toLowerCase()),
    );
    setMatchedBoards(filteredKeywords);
  };

  // for the input change
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    getMatchedKeywords(value); // Update matched keywords based on search input
  };

  // for loading boards in state
  useEffect(() => {
    // simulating slow response
    setTimeout(() => {
      setBoards(dummyData);
      setMatchedBoards(dummyData);
    }, 1500);
  }, []);

  return (
    <div>
      {/* Search Input */}
      <div>
        <Input
          placeholder="Search boards"
          maxLength={30}
          value={searchInput}
          onChange={handleInputChange}
        />
      </div>

      {/* Loading State when boards are being fetched */}
      {!boards && (
        <div className="mt-10 flex flex-row justify-center items-center">
          <Loader2 className="animate-spin mr-2 text-[#71717A]" />
          <p className="text-md text-muted-foreground">Loading..</p>
        </div>
      )}

      {/* When boards list is empty */}
      {boards && boards.length < 1 && (
        <div className="mt-10">
          <p className="text-md text-center text-muted-foreground">
            No boards found. Click the 'Create Board' button to add one.
          </p>
        </div>
      )}

      {/* When Boards are loaded */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {boards &&
          matchedBoards.map((board) => (
            <Link href={`/boards/${board.id}`} key={board.id}>
              <div
                style={{ background: board.background }}
                className="text-white rounded-md px-4 py-3 h-[90px] rounded-md hover:opacity-90 transition-opacity"
              >
                <p className="text-md font-semibold line-clamp-2">
                  {board.name}
                </p>
              </div>
            </Link>
          ))}
      </div>

      {/* When no match found while searching */}
      {searchInput.length > 0 && matchedBoards.length < 1 && (
        <div className="mt-10">
          <p className="text-md text-center text-muted-foreground">
            No boards found.
          </p>
        </div>
      )}
    </div>
  );
}

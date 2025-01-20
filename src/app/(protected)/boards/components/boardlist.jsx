"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import LockIcon from '@mui/icons-material/Lock';


export function BoardsList({ data }) {
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
    setBoards(data);
    setMatchedBoards(data);
  }, [data]);


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
                className="text-white flex flex-col justify-between rounded-md px-4 py-3 h-[90px] rounded-md hover:opacity-90 transition-opacity"
              >
                <p className="text-md font-semibold line-clamp-2">
                  {board.name}
                </p>

                {/* Displaying Lock Icon if the board is marked as closed */}
                <div className="flex flex-row justify-end">
                  {board.isClosed && <LockIcon className="h-3 w-3 opacity-90" />}
                </div>
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

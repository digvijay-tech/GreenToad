"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileContext } from "@/contexts/profile";
import { UserProfileType } from "@/contexts/profile/types";
import { BoardType } from "../actions/types";
import { getBoardById } from "../actions";
import { BoardHeader } from "./header";
import { errorToast } from "@/utils/toasts";

export function BoardPageWrapper({ boardId }: { boardId: string }) {
  const { toast } = useToast();
  const { profile, getProfile, removeUserProfileContext } =
    useUserProfileContext();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [board, setBoard] = useState<BoardType | null>(null);

  // refresh the UserProfileContext and board state
  const triggerRefresh = () => {
    removeUserProfileContext(); // remove context
    setBoard(null); // triggers the loading state
  };

  // fire on load and profile change
  useEffect(() => {
    (async function () {
      const profileResult = await getProfile();

      if (profileResult) {
        setUserProfile(profileResult);

        const boardResult = await getBoardById(
          boardId,
          profileResult.default_workspace_id,
        );

        if (boardResult instanceof Error) {
          errorToast(toast, boardResult.message);
          return;
        }

        setBoard(boardResult[0]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <div>
      {/* Board Heading and Controls */}
      {userProfile && board ? (
        <div>
          <BoardHeader
            board={board}
            workspaceId={userProfile.default_workspace_id}
            cb={triggerRefresh}
          />
        </div>
      ) : (
        <div>
          <p className="">Loading..</p>
        </div>
      )}
    </div>
  );
}

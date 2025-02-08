"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUserProfileContext } from "@/contexts/profile/index";
import { WorkspaceType } from "@/contexts/profile/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";

export function ManageWorkspacesButton() {
  const { workspaces, getWorkspaces } = useUserProfileContext();
  const [availableWorkspaces, setAvailableWorkspaces] = useState<
    WorkspaceType[] | null
  >(null);
  const [totalWorkspaces, setTotalWorkspaces] = useState<number>(0);

  // on load and workspace context change
  useEffect(() => {
    (async function () {
      const result = await getWorkspaces();

      setAvailableWorkspaces(result);

      if (availableWorkspaces && availableWorkspaces.length) {
        setTotalWorkspaces(availableWorkspaces.length);
      }
    })();
  }, [workspaces, getWorkspaces, availableWorkspaces]);

  return (
    <Card className="h-full shadow-none flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Manage Workspace</CardTitle>
        <CardDescription>
          You can rename, delete, and view your workspaces. Currently, you have{" "}
          {totalWorkspaces} workspaces.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Link href="/settings/manage-workspaces">
            <Button className="w-full">
              <Edit2Icon className="h-4 w-4" />
              Manage
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

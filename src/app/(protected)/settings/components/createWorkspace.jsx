"use client";

import { useState } from "react";
import { createWorkspace } from "../actions/index";
import { useUserProfileContext } from "@/contexts/profile/index";
import { successToast, errorToast } from "@/utils/toasts/index";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CreateWorkspace() {
  const { toast } = useToast();
  const { removeUserProfileContext } = useUserProfileContext();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // validate name length
    if (name.length < 3 || name.length > 24) {
      errorToast(
        toast,
        "Name should be between 3 and 24 characters in length!",
      );
      setIsLoading(false);
      return;
    }

    // handle api call
    try {
      const result = await createWorkspace(name);

      if (result instanceof Error) {
        throw result;
      }

      // displaying success message and removing current profile context
      // to load changes made in workspaces table
      successToast(toast, "Workspace created!");
      removeUserProfileContext();
    } catch (e) {
      if (e instanceof Error) {
        errorToast(toast, e.message);
      } else {
        errorToast(toast, "Something went wrong!");
        console.log("From Catch Unknown!", e);
      }
    }

    setName("");
    setIsLoading(false);
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Create Workspace</CardTitle>
        <CardDescription>
          You can create up to 4 workspaces in total.
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateWorkspace}>
          <div>
            <Label htmlFor="name">Enter Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              maxLength={24}
              required
            />
          </div>
          <div className="mt-3">
            {isLoading ? (
              <Button className="w-full md:w-auto select-none" disabled>
                <Loader2 className="animate-spin" />
                Loading..
              </Button>
            ) : (
              <Button type="submit" className="w-full md:w-auto select-none">
                Create
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

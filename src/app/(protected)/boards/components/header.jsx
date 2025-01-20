"use client";

import { HeadingTwo } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

{
  /* Page Heading and Create Board Button */
}
export function BoardPageHeader() {
  return (
    <div className="flex flex-row justify-between items-center">
      <HeadingTwo text="Boards" />

      <div>
        <Button variant="outline">
          <PlusCircleIcon />
          Create
        </Button>
      </div>
    </div>
  );
}

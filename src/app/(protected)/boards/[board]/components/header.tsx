"use client";

import { HeadingFour } from "@/components/typography/headings";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export function BoardHeader({ boardName }: { boardName: string }) {
  return (
    <div className="">
      <div className="flex flex-row items-center justify-between">
        <HeadingFour text={`Name: ${boardName}`} />

        <Button variant="ghost" size="icon">
          <MoreVertIcon className="h-4 w-4" />
        </Button>
      </div>

      <Separator />
    </div>
  );
}

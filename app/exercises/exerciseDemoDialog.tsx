"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import ReactPlayer from "react-player/lazy";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ExercisesDemoDialogProps {
  url: string;
}

export const ExerciseDemoDialog = ({ url }: ExercisesDemoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>Demo</DialogTrigger>
      <DialogContent>
        <ReactPlayer
          fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 width={100} height={100} className="animate-spin" />
            </div>
          }
          controls
          url={url}
          width={"auto"}
        />
      </DialogContent>
    </Dialog>
  );
};

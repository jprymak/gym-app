import React, { useState } from "react";
import { Import } from "lucide-react";

import { IconButton } from "@/components/iconButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ImportExercise } from "./importExercise";

export const ImportExercisesDialog = () => {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton tooltip="Import exercises" icon={<Import />} />
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Import exercises</DialogTitle>
        </DialogHeader>
        <ImportExercise closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};

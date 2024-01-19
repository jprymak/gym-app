import React, { useState } from "react";
import { Plus } from "lucide-react";

import { IconButton } from "@/components/iconButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ExerciseForm } from "./exerciseForm";

export const AddExerciseDialog = () => {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton icon={<Plus />} variant="default" tooltip="Add exercise" />
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add exercise</DialogTitle>
        </DialogHeader>
        <ExerciseForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};

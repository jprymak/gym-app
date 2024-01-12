import React, { useState } from "react";
import { FileEdit, Plus } from "lucide-react";

import { IconButton } from "@/components/iconButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Exercise } from "./columns";
import { ExerciseForm } from "./exerciseForm";

interface EditExerciseDialogProps {
  data?: Exercise;
}

export const EditExerciseDialog = ({ data }: EditExerciseDialogProps) => {
  const [open, setOpen] = useState(false);

  const editMode = !!data || false;

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          icon={editMode ? <FileEdit /> : <Plus />}
          variant={editMode ? "ghost" : "default"}
          tooltip={editMode ? "Edit exercise" : "Add exercise"}
          {...(!editMode && { label: "Add exercise" })}
        />
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit exercise" : "Add exercise"}
          </DialogTitle>
        </DialogHeader>
        <ExerciseForm data={data} closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};

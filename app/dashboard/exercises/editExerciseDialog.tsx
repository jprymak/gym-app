import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileEdit, Plus } from "lucide-react";
import { ExerciseForm } from "./exerciseForm";
import { Exercise } from "./columns";
import { Button } from "@/components/ui/button";

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
        <Button>
          {editMode ? (
            <FileEdit />
          ) : (
            <>
              <Plus className="mr-2" />
              Add exercise
            </>
          )}
        </Button>
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

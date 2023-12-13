import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { ExerciseForm } from "./exerciseForm";
import { ExercisePartial } from "./columns";
import { Button } from "@/components/ui/button";

interface EditExerciseDialogProps {
  data?: ExercisePartial;
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
            <FaEdit />
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

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogContext } from "@/lib/context/useDialogContext";

import { ExerciseForm } from "./exerciseForm";

export const EditExerciseDialog = () => {
  const { openDialogs, rowData, close } = useDialogContext();

  return (
    <Dialog open={openDialogs.edit} onOpenChange={() => close("edit")}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit exercise</DialogTitle>
        </DialogHeader>
        <ExerciseForm data={rowData} closeDialog={() => close("edit")} />
      </DialogContent>
    </Dialog>
  );
};

"use client";
import React, { useTransition } from "react";

import { DeleteBtnWithStatus } from "@/components/deleteBtnWithStatus";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDialogContext } from "@/lib/context/useDialogContext";
import { deleteExercise } from "@/lib/data/exercises";

export const DeleteExerciseDialog = () => {
  const { openDialogs, rowData, close } = useDialogContext();
  const [isPending, startTransition] = useTransition();

  const handleDeleteExercise = async () => {
    startTransition(async () => {
      const result = await deleteExercise(rowData.id);

      if ("error" in result) {
        toast({
          variant: "destructive",
          title: result.error,
        });
      } else {
        toast({
          title: "Exercise was deleted.",
        });
      }
      close("delete");
    });
  };

  return (
    <Dialog open={openDialogs.delete} onOpenChange={() => close("delete")}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete exercise</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{rowData?.name}</strong> ?
          This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <DeleteBtnWithStatus
            onClick={handleDeleteExercise}
            isPending={isPending}
          />
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

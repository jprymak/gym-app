"use client";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { XCircle } from "lucide-react";
import { Exercise } from "./columns";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { deleteExercise } from "@/lib/data";
import { DeleteBtnWithStatus } from "@/components/deleteBtnWithStatus";

interface DeleteExerciseDialogProps {
  data: Exercise;
}

export const DeleteExerciseDialog = ({ data }: DeleteExerciseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDeleteExercise = async () => {
    startTransition(async () => {
      const result = await deleteExercise(data.id);

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
      closeDialog();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <XCircle />
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete exercise</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{data.name}</strong> ? This
          action cannot be undone.
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

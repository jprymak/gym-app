"use client";
import React, { useState, useTransition } from "react";
import { XCircle } from "lucide-react";

import { DeleteBtnWithStatus } from "@/components/deleteBtnWithStatus";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { bulkDeleteExercise } from "@/lib/data";

import { Exercise } from "./columns";

interface DeleteExerciseDialogProps {
  data: Exercise[];
  selectedRows?: { [key: string]: Boolean };
}

export const BulkDeleteExerciseDialog = ({
  data,
  selectedRows = {},
}: DeleteExerciseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const exercisesToDelete = data.filter((exercise) => {
    return Object.keys(selectedRows).includes(exercise.id);
  });

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDeleteExercise = async () => {
    startTransition(async () => {
      const result = await bulkDeleteExercise(Object.keys(selectedRows));

      if ("error" in result) {
        toast({
          variant: "destructive",
          title: result.error,
        });
      } else {
        toast({
          title: "Exercises were deleted.",
        });
      }
      closeDialog();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!!exercisesToDelete.length && (
        <DialogTrigger asChild>
          <Button variant="destructive" className="mr-2">
            <XCircle className="mr-2" />
            Delete exercise
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete exercises</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete?</p>
        <ul>
          {exercisesToDelete.map((exercise) => (
            <li className="font-bold" key={exercise.id}>
              {exercise.name}
            </li>
          ))}
        </ul>
        <p> This action cannot be undone.</p>
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

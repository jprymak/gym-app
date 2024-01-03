"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvailableStoredDataDialogProps {
  open: boolean;
  setOpen: () => void;
  accept: () => void;
}

export const AvailableStoredDataDialog = ({
  open,
  setOpen,
  accept,
}: AvailableStoredDataDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Load from storage</DialogTitle>
        </DialogHeader>
        <p>
          Would you like to load from storage recent changes that were not
          saved?
        </p>
        <div className="flex gap-2 justify-end">
          <Button onClick={accept}>Accept</Button>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

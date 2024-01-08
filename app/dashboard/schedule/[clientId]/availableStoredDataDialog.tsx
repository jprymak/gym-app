"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvailableStoredDataDialogProps {
  open: boolean;
  setOpen: () => void;
  handleAccept: () => void;
  handleReject: () => void;
}

export const AvailableStoredDataDialog = ({
  open,
  setOpen,
  handleAccept,
  handleReject,
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
        <p className="text-destructive">
          Clicking &quot;Reject&quot; removes data from local storage. This
          action cannot be undone!
        </p>
        <div className="flex gap-2 justify-end">
          <Button onClick={handleAccept}>Accept</Button>
          <DialogClose onClick={handleReject} asChild>
            <Button variant="destructive">Reject</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

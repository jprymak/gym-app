import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  dialogTriggerContent: React.ReactNode;
}

export const CommonDialog = ({
  children,
  title,
  description,
  dialogTriggerContent,
}: EditDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{dialogTriggerContent}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

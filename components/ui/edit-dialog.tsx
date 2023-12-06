import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";

interface EditDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const EditDialog = ({
  children,
  title,
  description,
}: EditDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <FaEdit />
      </DialogTrigger>
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

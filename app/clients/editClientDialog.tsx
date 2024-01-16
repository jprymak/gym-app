import React, { useState } from "react";
import { FileEdit, Plus } from "lucide-react";

import { IconButton } from "@/components/iconButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ClientForm } from "./clientForm";
import { Client } from "./columns";

interface EditClientDialogProps {
  data?: Client;
}

export const EditClientDialog = ({ data }: EditClientDialogProps) => {
  const [open, setOpen] = useState(false);

  const editMode = !!data || false;

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          icon={editMode ? <FileEdit /> : <Plus />}
          variant={editMode ? "ghost" : "default"}
          tooltip={editMode ? "Edit client" : "Add client"}
          {...(!editMode && { label: "Add client" })}
        />
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit client" : "Add client"}</DialogTitle>
        </DialogHeader>
        <ClientForm data={data} closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};

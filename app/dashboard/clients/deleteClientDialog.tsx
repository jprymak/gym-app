"use client";
import React, { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { DeleteBtnWithStatus } from "@/components/deleteBtnWithStatus";
import { IconButton } from "@/components/iconButton";
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
import { deleteClient } from "@/lib/data";

import { Client } from "./columns";

interface DeleteClientDialogProps {
  data: Client;
}

export const DeleteClientDialog = ({ data }: DeleteClientDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDeleteClient = async () => {
    startTransition(async () => {
      const result = await deleteClient(data.id);

      if ("error" in result) {
        toast({
          variant: "destructive",
          title: result.error,
        });
      } else {
        toast({
          title: "Client was deleted.",
        });
      }
      closeDialog();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          tooltip="Delete client"
          icon={<Trash2 className="text-destructive" />}
          variant="ghost"
        />
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete client</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{data.name}</strong> ? This
          action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <DeleteBtnWithStatus
            onClick={handleDeleteClient}
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

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/ui/sortableHeader";
import { CommonDialog } from "@/app/components/dialog/dialog";
import { ClientForm } from "./clientForm";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { FileEdit, XCircle } from "lucide-react";

export type ClientPartial = {
  name: string;
  surname: string;
  email: string;
  status: string;
};

export type Client = {
  id: string;
  added: string;
} & ClientPartial;

export const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortableHeader header="Name" column={column} />;
    },
  },
  {
    accessorKey: "surname",
    header: ({ column }) => {
      return <SortableHeader header="Surname" column={column} />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <SortableHeader header="Email" column={column} />;
    },
  },
  {
    accessorKey: "added",
    header: ({ column }) => {
      return <SortableHeader header="Added" column={column} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortableHeader header="Status" column={column} />;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-4 items-center justify-center">
          <CommonDialog
            title={"Delete client"}
            dialogTriggerContent={<XCircle />}
          >
            <p>
              Are you sure you want to delete{" "}
              <strong>{row.original.email}</strong> ? This action cannot be
              undone.
            </p>
            <div className="flex gap-2 justify-end">
              <DialogClose>
                <Button variant="destructive">Delete</Button>
              </DialogClose>
              <DialogClose>
                <Button>Cancel</Button>
              </DialogClose>
            </div>
          </CommonDialog>
          <CommonDialog
            title={"Edit exercise"}
            dialogTriggerContent={<FileEdit />}
          >
            <ClientForm data={row.original} />
          </CommonDialog>
        </div>
      );
    },
  },
];

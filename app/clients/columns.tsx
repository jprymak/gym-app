"use client";

import { SortableHeader } from "@/components/ui/sortableHeader";
import type { Client } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

import { DeleteClientDialog } from "./deleteClientDialog";
import { EditClientDialog } from "./editClientDialog";

export type ClientPartial = {
  name: string;
  surname: string;
  email: string;
  status: string;
};

export const columns: ColumnDef<Client>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortableHeader header="Name" column={column} />;
    },
    sortingFn: "text",
  },
  {
    accessorKey: "surname",
    header: ({ column }) => {
      return <SortableHeader header="Surname" column={column} />;
    },
    sortingFn: "text",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <SortableHeader header="Email" column={column} />;
    },
    sortingFn: "text",
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return <SortableHeader header="Created" column={column} />;
    },
    cell: ({ row }) => row.original.created.toISOString().split("T")[0],
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
          <EditClientDialog data={row.original} />
          <DeleteClientDialog data={row.original} />
        </div>
      );
    },
  },
];

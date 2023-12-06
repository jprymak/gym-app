"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { SortableHeader } from "@/components/ui/sortableHeader";

export type Trainee = {
  id: string;
  name: string;
  surname: string;
  email: string;
  added: string;
  status: string;
};

export const columns: ColumnDef<Trainee>[] = [
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
          <button>
            <MdDelete />
          </button>
          <button>
            <FaEdit />
          </button>
        </div>
      );
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { SortableHeader } from "@/components/ui/sortableHeader";

export type Exercise = {
  id: string;
  number: number;
  name: string;
  muscleGroups: string;
  demoLink: string;
  usedBy: number;
  created: string;
  modified: string;
};

export const columns: ColumnDef<Exercise>[] = [
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
    accessorKey: "number",
    header: "Number",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortableHeader header="Name" column={column} />;
    },
  },
  {
    accessorKey: "muscleGroups",
    header: "Muscle groups",
  },
  {
    accessorKey: "demoLink",
    header: "Demo link",
  },
  {
    accessorKey: "usedBy",
    header: ({ column }) => {
      return <SortableHeader header="Used By" column={column} />;
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return <SortableHeader header="Created" column={column} />;
    },
  },
  {
    accessorKey: "modified",
    header: ({ column }) => {
      return <SortableHeader header="Modified" column={column} />;
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

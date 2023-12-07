"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MdDelete } from "react-icons/md";
import { SortableHeader } from "@/components/ui/sortableHeader";

import { CommonDialog } from "@/app/components/dialog/dialog";
import { ExerciseForm } from "./exerciseForm";
import { FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

type MuscleGroup =
  | "chest"
  | "back"
  | "biceps"
  | "triceps"
  | "abs"
  | "quadriceps"
  | "hamstrings"
  | "calves"
  | "shoulders"
  | "glutes"
  | "forearms";

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "biceps",
  "triceps",
  "abs",
  "quadriceps",
  "hamstrings",
  "calves",
  "shoulders",
  "glutes",
  "forearms",
];

export type ExercisePartial = {
  name: string;
  muscleGroups: MuscleGroup[];
  demoLink: string;
};

export type Exercise = ExercisePartial & {
  id: string;
  number: number;
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
          <CommonDialog
            title={"Edit exercise"}
            dialogTriggerContent={<FaEdit />}
          >
            <ExerciseForm data={row.original} />
          </CommonDialog>
          <CommonDialog
            title={"Delete exercise"}
            dialogTriggerContent={<MdDelete />}
          >
            <p>
              Are you sure you want to delete{" "}
              <strong>{row.original.name}</strong> ? This action cannot be
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
        </div>
      );
    },
  },
];
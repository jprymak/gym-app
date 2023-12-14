"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/ui/sortableHeader";

import { EditExerciseDialog } from "./editExerciseDialog";
import { DeleteExerciseDialog } from "./deleteExerciseDialog";

export const MUSCLE_GROUPS = [
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
  muscleGroups: string[];
  demoLink: string;
};

export type Exercise = ExercisePartial & {
  id: string;
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
  // { TO DO: add once realtions are ready
  //   accessorKey: "usedBy",
  //   header: ({ column }) => {
  //     return <SortableHeader header="Used By" column={column} />;
  //   },
  // },
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
          <EditExerciseDialog data={row.original} />
          <DeleteExerciseDialog data={row.original} />
        </div>
      );
    },
  },
];

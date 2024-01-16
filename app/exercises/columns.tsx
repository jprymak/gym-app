"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/ui/sortableHeader";
import { ColumnDef } from "@tanstack/react-table";

import { DeleteExerciseDialog } from "./deleteExerciseDialog";
import { EditExerciseDialog } from "./editExerciseDialog";
import { PreparedExercisesData } from "./exercisesDataTable";

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

export const columns: ColumnDef<PreparedExercisesData>[] = [
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
        disabled={!!row.original.scheduledExercise.length}
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
    sortingFn: "text",
  },
  {
    accessorKey: "muscleGroups",
    header: "Muscle groups",
    accessorFn: (row) => row.muscleGroups.join(", "),
  },
  {
    accessorKey: "demoLink",
    header: "Demo",
    cell: ({ row }) => {
      return row.original.demoLink ? (
        <a target="blank" href={row.original.demoLink}>
          Link
        </a>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => {
      return <SortableHeader header="Assigned To" column={column} />;
    },
    cell: ({ row }) => {
      return (
        <p className=" text-center">{row.original.scheduledExercise.length}</p>
      );
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
          <EditExerciseDialog data={row.original} />
          <DeleteExerciseDialog data={row.original} />
        </div>
      );
    },
  },
];

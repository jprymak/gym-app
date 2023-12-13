"use client";

import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";
import { Exercise } from "./columns";
import { EditExerciseDialog } from "./editExerciseDialog";

interface ExercisesDataTableProps {
  data: Exercise[];
}

export const ExercisesDataTable = ({ data }: ExercisesDataTableProps) => {
  return (
    <DataTable columns={columns} data={data}>
      <EditExerciseDialog />
    </DataTable>
  );
};

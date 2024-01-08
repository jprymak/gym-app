"use client";

import { DataTable } from "@/components/ui/data-table";

import { BulkDeleteExerciseDialog } from "./bulkDeleteExercise";
import { columns } from "./columns";
import { Exercise } from "./columns";
import { EditExerciseDialog } from "./editExerciseDialog";

interface ExercisesDataTableProps {
  data: Exercise[];
}

export const ExercisesDataTable = ({ data }: ExercisesDataTableProps) => {
  return (
    <DataTable columns={columns} data={data}>
      <BulkDeleteExerciseDialog data={data} />
      <EditExerciseDialog />
    </DataTable>
  );
};

"use client";

import { DataTable } from "@/components/ui/data-table";
import { ExerciseWithScheduledExercises } from "@/lib/data/types";
import { Row } from "@tanstack/react-table";

import { AddExerciseDialog } from "./addExerciseDialog";
import { BulkDeleteExerciseDialog } from "./bulkDeleteExercise";
import { columns } from "./columns";
import { DeleteExerciseDialog } from "./deleteExerciseDialog";
import { EditExerciseDialog } from "./editExerciseDialog";
import { ImportExercisesDialog } from "./importExercisesDialog";

interface ExercisesDataTableProps {
  data: ExerciseWithScheduledExercises[];
}

export const ExercisesDataTable = ({ data }: ExercisesDataTableProps) => {
  const enableRowSelectionFn = (row: Row<ExerciseWithScheduledExercises>) => {
    return !!!row.original.scheduledExercise.length;
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowSelectionFn={enableRowSelectionFn}
      initialSort={[
        {
          id: "modified",
          desc: true,
        },
      ]}
    >
      <AddExerciseDialog />
      <ImportExercisesDialog />
      <BulkDeleteExerciseDialog data={data} />
      <EditExerciseDialog />
      <DeleteExerciseDialog />
    </DataTable>
  );
};

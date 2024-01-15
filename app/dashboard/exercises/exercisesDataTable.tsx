"use client";

import { DataTable } from "@/components/ui/data-table";
import { ExerciseWithScheduledExercises } from "@/lib/data/types";
import { Row } from "@tanstack/react-table";

import { BulkDeleteExerciseDialog } from "./bulkDeleteExercise";
import { columns } from "./columns";
import { EditExerciseDialog } from "./editExerciseDialog";

export interface PreparedExercisesData
  extends Omit<ExerciseWithScheduledExercises, "created" | "modified"> {
  created: string;
  modified: string;
}

interface ExercisesDataTableProps {
  data: PreparedExercisesData[];
}

export const ExercisesDataTable = ({ data }: ExercisesDataTableProps) => {
  const enableRowSelectionFn = (row: Row<PreparedExercisesData>) => {
    return !!!row.original.scheduledExercise.length;
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowSelectionFn={enableRowSelectionFn}
    >
      <BulkDeleteExerciseDialog data={data} />
      <EditExerciseDialog />
    </DataTable>
  );
};

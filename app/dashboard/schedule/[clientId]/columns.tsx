import { useEffect, useState } from "react";
import { Copy, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MARGINAL_VALUES } from "@/lib/constants";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import { ExerciseCombobox } from "../exerciseCombobox";

import { PreparedScheduledExercise } from "./schedule";

interface ScheduledExerciseField extends CellContext<any, string> {
  marginalValues: { max: number; min: number };
}

const TableCellWithTextArea = ({
  getValue,
  row,
  column: { id },
  table,
  marginalValues,
}: ScheduledExerciseField) => {
  const initialValue = getValue();

  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.original.id, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Textarea
      placeholder={`Max character count is ${marginalValues.max}`}
      maxLength={marginalValues.max}
      className=" w-36"
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};

const TableCellWithNumInput = ({
  getValue,
  row,
  column: { id },
  table,
  marginalValues,
}: ScheduledExerciseField) => {
  const initialValue = getValue();

  const [value, setValue] = useState(initialValue);

  const badValue = +value < marginalValues.min || +value > marginalValues.max;

  const onBlur = () => {
    table.options.meta?.updateData(row.original.id, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      className={`w-16 ${badValue && "text-white bg-destructive"}`}
      value={value as string}
      min={marginalValues.min}
      max={marginalValues.max}
      type="number"
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};

export const columns: ColumnDef<PreparedScheduledExercise>[] = [
  {
    id: "bottom-row",
    header: ({ table }) => (
      <div className="flex items-center py-2">
        <h2 className="font-bold text-lg mr-auto">
          Day: {table.options.meta?.getTableTitle()}
        </h2>

        <Button variant="ghost" onClick={() => table.options.meta?.deleteDay()}>
          <Trash2 className="text-destructive" />
        </Button>
      </div>
    ),
    columns: [
      {
        header: "Num",
        accessorKey: "ordinalNum",
        cell: ({ row }) => {
          return row.original.ordinalNum;
        },
      },
      {
        header: "Exercise",
        accessorKey: "exerciseId",
        cell: ExerciseCombobox,
      },
      {
        accessorKey: "sets",
        header: "Sets",
        cell: (props) => (
          <TableCellWithNumInput
            marginalValues={MARGINAL_VALUES.sets}
            {...props}
          />
        ),
      },
      {
        accessorKey: "reps",
        header: "Reps",
        cell: (props) => (
          <TableCellWithNumInput
            marginalValues={MARGINAL_VALUES.reps}
            {...props}
          />
        ),
      },
      {
        header: "RPE",
        accessorKey: "rpe",
        cell: (props) => (
          <TableCellWithNumInput
            marginalValues={MARGINAL_VALUES.rpe}
            {...props}
          />
        ),
      },
      {
        header: "Comment",
        accessorKey: "comment",
        cell: (props) => {
          return (
            <TableCellWithTextArea
              marginalValues={MARGINAL_VALUES.comment}
              {...props}
            />
          );
        },
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row, table }) => {
          const reachedExerciseLimit =
            !!table.options.meta?.getDataLength() &&
            table.options.meta?.getDataLength() >= 8;
          return (
            <div className="flex">
              <Button
                disabled={reachedExerciseLimit}
                onClick={() => table.options.meta?.copyRow(row.original)}
                variant="ghost"
              >
                <Copy />
              </Button>
              <Button
                onClick={() => table.options.meta?.deleteRow(row.original.id)}
                variant="ghost"
              >
                <X className="text-destructive" />
              </Button>
            </div>
          );
        },
      },
    ],
  },
];

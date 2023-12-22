import { Button } from "@/components/ui/button";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { GripVertical, XCircle } from "lucide-react";
import { ExerciseCombobox } from "../exerciseCombobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { PreparedRow } from "./schedule";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const TableCellWithTextArea = ({
  getValue,
  row,
  column: { id },
  table,
}: CellContext<any, string>) => {
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
}: CellContext<any, string>) => {
  const initialValue = getValue();

  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.original.id, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      className=" w-14"
      value={value as string}
      type="number"
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};

export const columns: ColumnDef<PreparedRow>[] = [
  {
    id: "bottom-row",
    header: ({ table }) => (
      <h2 className=" font-bold text-lg">
        Day: {table.options.meta?.getTableTitle()}
      </h2>
    ),
    columns: [
      {
        header: "Exercise",
        accessorKey: "exerciseId",
        cell: ExerciseCombobox,
      },
      {
        accessorKey: "sets",
        header: "Sets",
        cell: TableCellWithNumInput,
      },
      {
        accessorKey: "reps",
        header: "Reps",
        cell: TableCellWithNumInput,
      },
      {
        header: "RPE",
        accessorKey: "rpe",
        cell: TableCellWithNumInput,
      },
      {
        header: "Comment",
        accessorKey: "comment",
        cell: (props) => {
          return <TableCellWithTextArea {...props} />;
        },
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row, table }) => {
          return (
            <div>
              <Button
                onClick={() => table.options.meta?.deleteRow(row.original.id)}
                variant="destructive"
                className="mr-2"
              >
                <XCircle />
              </Button>
            </div>
          );
        },
      },
    ],
  },
];

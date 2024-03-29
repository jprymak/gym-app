import { TableCell, TableRow } from "@/components/ui/table";
import type { PreparedScheduledExercise } from "@/lib/types/schedule";
import type { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import { DragHandle } from "./dragHandle";

export const StaticTableRow = ({
  row,
}: {
  row: Row<PreparedScheduledExercise> | undefined | null;
}) => {
  return (
    <TableRow {...row} className="shadow-sm">
      {row?.getVisibleCells().map((cell, i) => {
        if (i === 0) {
          return (
            <TableCell key={cell.id} className="py-1">
              <div className="flex gap-2 items-center">
                <DragHandle isDragging />
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </TableCell>
          );
        }
        return (
          <TableCell key={cell.id} className="py-1">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

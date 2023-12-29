import { TableRow, TableCell } from "@/components/ui/table";
import { Row, flexRender } from "@tanstack/react-table";
import { PreparedScheduledExercise } from "./schedule";
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

import { TableRow, TableCell } from "@/components/ui/table";
import { Row, flexRender } from "@tanstack/react-table";
import { PreparedRow } from "./schedule";
import { DragHandle } from "./dragHandle";

export const StaticTableRow = ({
  row,
}: {
  row: Row<PreparedRow> | undefined | null;
}) => {
  return (
    <TableRow {...row} className="shadow-sm">
      {row?.getVisibleCells().map((cell, i) => {
        if (i === 0) {
          return (
            <TableCell key={cell.id} className="flex gap-3 items-center">
              <DragHandle isDragging />
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

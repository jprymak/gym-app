import { TableCell, TableRow } from "@/components/ui/table";
import type { PreparedScheduledExercise } from "@/lib/types/schedule";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import { DragHandle } from "./dragHandle";

export const DraggableTableRow = ({
  row,
}: {
  row: Row<PreparedScheduledExercise>;
}) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: row.original.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className="h-full"
      data-testid={`row-${row.index}`}
    >
      {isDragging ? (
        <TableCell colSpan={6} className="h-[69px]">
          &nbsp;
        </TableCell>
      ) : (
        row.getVisibleCells().map((cell, index) => {
          return index === 0 ? (
            <TableCell key={cell.id} className="py-1">
              <div className="flex gap-2 items-center">
                <DragHandle {...attributes} {...listeners} />
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </TableCell>
          ) : (
            <TableCell key={cell.id} className="py-1">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })
      )}
    </TableRow>
  );
};

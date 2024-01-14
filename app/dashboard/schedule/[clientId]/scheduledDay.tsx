"use client";

import React, { useMemo, useState } from "react";
import { MoveDown, MoveUp, Plus } from "lucide-react";

import { DraggableTableRow } from "@/components/draggableTableRow";
import { IconButton } from "@/components/iconButton";
import { StaticTableRow } from "@/components/staticTableRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Direction, SCHEDULED_EXERCISE_DAY_LIMIT } from "@/lib/constants";
import { PreparedScheduledExercise } from "@/lib/types/schedule";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Exercise } from "@prisma/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData extends PreparedScheduledExercise, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: Array<TData>;
  exercises: Exercise[];
  deleteDay: (idToDelete: string) => void;
  scheduledDayId: string;
  title: string;
  addExercise: (scheduledDayId: string) => void;
  copyExercise: (scheduledExercise: PreparedScheduledExercise) => void;
  deleteExercise: (scheduledDayId: string, rowToDeleteId: string) => void;
  updateExercise: (
    scheduledDayId: string,
    columnId: string,
    value: string,
    rowId: string
  ) => void;
  reorderExercises: (
    scheduledDayId: string,
    array: PreparedScheduledExercise[]
  ) => void;
  moveDay: (scheduledDayId: string, direction: Direction) => void;
  isFirst: boolean;
  isLast: boolean;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line
  interface TableMeta<TData extends RowData> {
    updateData: (rowId: string, columnId: string, value: string) => void;
    getExercises: () => Exercise[];
    deleteRow: (id: string) => void;
    copyRow: (scheduledExercise: PreparedScheduledExercise) => void;
    deleteDay: () => void;
    getTableTitle: () => string;
    getDataLength: () => number;
  }
}

export function ScheduledDay<TData extends PreparedScheduledExercise, TValue>({
  columns,
  data,
  exercises,
  deleteDay,
  scheduledDayId,
  title,
  addExercise,
  copyExercise,
  deleteExercise,
  updateExercise,
  reorderExercises,
  moveDay,
  isFirst,
  isLast,
}: DataTableProps<TData, TValue>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const items = useMemo(() => data?.map(({ id }) => id), [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowId, columnId, value) => {
        updateExercise(scheduledDayId, columnId, value, rowId);
      },
      getExercises: () => exercises,
      deleteRow: (id) => {
        deleteExercise(scheduledDayId, id);
      },
      getTableTitle: () => title,
      deleteDay: () => deleteDay(scheduledDayId),
      copyRow: (scheduledExercise) => {
        copyExercise(scheduledExercise);
      },
      getDataLength: () => data.length,
    },
  });

  const hasRowsToRender = table
    .getRowModel()
    .rows.some((row) => !row.original.taggedForDelete);

  const dayLimitRached = data.length >= SCHEDULED_EXERCISE_DAY_LIMIT;

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const movedArray = arrayMove(data, oldIndex, newIndex);
      reorderExercises(scheduledDayId, movedArray);
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const selectedRow = useMemo(() => {
    if (!activeId) {
      return null;
    }
    const row = table
      .getRowModel()
      .rows.find(({ original }) => original.id === activeId);
    return row;
  }, [activeId, table]);

  return (
    <div className="flex" data-testid={`day-${title}`}>
      <div className="flex flex-col gap-2 mr-2">
        <IconButton
          disabled={isFirst}
          tooltip="Move Up"
          icon={<MoveUp />}
          onClick={() => moveDay(scheduledDayId, Direction.Up)}
          variant="outline"
        />
        <IconButton
          tooltip="Move Down"
          icon={<MoveDown />}
          disabled={isLast}
          onClick={() => moveDay(scheduledDayId, Direction.Down)}
          variant="outline"
        />
        <IconButton
          tooltip="Add exercise row"
          icon={<Plus />}
          disabled={dayLimitRached}
          variant="outline"
          onClick={() => addExercise(scheduledDayId)}
        />
      </div>
      <div className="rounded-md border">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody data-testid="tbody">
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {hasRowsToRender ? (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <DraggableTableRow key={row.original.id} row={row} />
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No exercises for this day.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
          <DragOverlay>
            {activeId && (
              <table style={{ width: "100%" }}>
                <tbody>
                  <StaticTableRow row={selectedRow} />
                </tbody>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

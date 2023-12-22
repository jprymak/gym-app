"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  ColumnDef,
  RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Exercise } from "@prisma/client";
import { PreparedRow } from "./schedule";
import { SCHEDULED_EXERCISE_DAY_LIMIT } from "@/lib/constants";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DraggableTableRow } from "./draggableTableRow";
import { StaticTableRow } from "./staticTableRow";

interface DataTableProps<TData extends PreparedRow, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: Array<TData>;
  exercises: Exercise[];
  deleteDay: (idToDelete: string) => void;
  scheduledDayId: string;
  title: string;
  addRow: (scheduledDayId: string) => void;
  deleteRow: (scheduledDayId: string, rowToDeleteId: string) => void;
  updateRow: (
    scheduledDayId: string,
    columnId: string,
    value: any,
    rowId: string
  ) => void;
  moveExercises: (scheduledDayId: string, array: PreparedRow[]) => void;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowId: string, columnId: string, value: string) => void;
    getExercises: () => Exercise[];
    deleteRow: (id: string) => void;
    getTableTitle: () => string;
  }
}

export function ScheduledDay<TData extends PreparedRow, TValue>({
  columns,
  data,
  exercises,
  deleteDay,
  scheduledDayId,
  title,
  addRow,
  deleteRow,
  updateRow,
  moveExercises,
}: DataTableProps<TData, TValue>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const items = useMemo(() => data?.map(({ id }) => id), [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowId, columnId, value) => {
        updateRow(scheduledDayId, columnId, value, rowId);
      },
      getExercises: () => exercises,
      deleteRow: (id) => {
        deleteRow(scheduledDayId, id);
      },
      getTableTitle: () => title,
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
      moveExercises(scheduledDayId, movedArray);
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
    <div className="flex">
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
            <TableBody>
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
                    <TableCell colSpan={6} className="h-24 text-center">
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
      <div className="flex flex-col gap-1 m-2">
        <Button
          disabled={dayLimitRached}
          onClick={() => addRow(scheduledDayId)}
        >
          Add row
        </Button>
        <Button variant="destructive" onClick={() => deleteDay(scheduledDayId)}>
          Delete day
        </Button>
      </div>
    </div>
  );
}

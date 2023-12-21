"use client";

import React from "react";
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
}: DataTableProps<TData, TValue>) {
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
  console.log(data);
  const dayLimitRached = data.length >= SCHEDULED_EXERCISE_DAY_LIMIT;

  return (
    <div className="flex">
      <div className="rounded-md border">
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
            {hasRowsToRender ? (
              table.getRowModel().rows.map((row) => {
                if (row.original.taggedForDelete) {
                  return null;
                }
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-1">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No exercises for this day.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  ColumnDef,
  Row,
  SortingState} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData & { id: string }, TValue>[];
  data: Array<TData & { id: string }>;
  enableRowSelectionFn?: (row: Row<TData>) => boolean;
  initialSort?: { id: string; desc: boolean }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  enableRowSelectionFn,
  initialSort,
}: React.PropsWithChildren<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    () => initialSort || []
  );
  const [searchString, setSearchString] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setSearchString,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableRowSelectionFn,
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (originalRow) => originalRow.id,
    state: {
      sorting,
      globalFilter: searchString,
      rowSelection,
    },
  });

  const hasSelectEnabled = React.useMemo(() => {
    return table
      .getHeaderGroups()
      .some((headerGroup) =>
        headerGroup.headers.some((header) => header.id === "select")
      );
  }, [table]);

  const renderChildren = () => {
    return React.Children.map(children, (child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          // eslint-disable-next-line
          // @ts-ignore
          selectedRows: rowSelection,
        });
      }
    });
  };

  return (
    <div className="md:mx-auto">
      <div className="flex items-start py-4 flex-col md:flex-row md:items-center gap-2">
        <Input
          placeholder="Filter rows..."
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
          className="w-56 mr-auto"
        />
        <div className="flex gap-2">{renderChildren()}</div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  data-testid={`row-${index}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between">
        <div className="flex-1 text-sm text-muted-foreground mt-1">
          {hasSelectEnabled &&
            `${table.getFilteredSelectedRowModel().rows.length} of ${
              table.getFilteredRowModel().rows.length
            }  row(s) selected.`}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <p className=" text-sm">
            {`Page ${
              table.getState().pagination.pageIndex + 1
            }/${table.getPageCount()}`}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

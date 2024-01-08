"use client";

import { ArrowDown, ArrowUp,ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";

export type SortableHeaderProps = {
  header: string;
  column: Column<any, unknown>;
};

export const SortableHeader = ({ header, column }: SortableHeaderProps) => {
  const columnIsSorted: boolean | string = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {header}
      {!columnIsSorted ? (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      ) : columnIsSorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUp className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

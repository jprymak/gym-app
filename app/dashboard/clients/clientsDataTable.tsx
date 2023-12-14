"use client";

import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";
import { EditClientDialog } from "./editClientDialog";
import { Client } from "./columns";

interface ClientDataTableProps {
  data: Client[];
}

export const ClientDataTable = ({ data }: ClientDataTableProps) => {
  return (
    <DataTable columns={columns} data={data}>
      <EditClientDialog />
    </DataTable>
  );
};

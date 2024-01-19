"use client";

import { DataTable } from "@/components/ui/data-table";
import { Client } from "@prisma/client";

import { columns } from "./columns";
import { EditClientDialog } from "./editClientDialog";

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

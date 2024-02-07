import { fetchClients } from "@/lib/data/clients";

import { ClientDataTable } from "./clientsDataTable";

export default async function Clients() {
  const data = await fetchClients();

  return <ClientDataTable data={data} />;
}

export const dynamic = "force-dynamic";

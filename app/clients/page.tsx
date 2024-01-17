import { fetchClients } from "@/lib/data/clients";

import { ClientDataTable } from "./clientsDataTable";

export default async function Clients() {
  const data = await fetchClients();

  const parsedData = data.map((item) => {
    return {
      ...item,
      created: item.created.toLocaleDateString(),
      modified: item.modified.toLocaleDateString(),
    };
  });

  return <ClientDataTable data={parsedData} />;
}

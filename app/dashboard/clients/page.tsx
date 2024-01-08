import { fetchClients } from "@/lib/data";

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

  return (
    <div className="container mx-auto py-10">
      <ClientDataTable data={parsedData} />
    </div>
  );
}

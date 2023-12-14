import { Client } from "./columns";
import { fetchClients } from "@/lib/data";
import { ClientDataTable } from "./clientsDataTable";

const clientsMock: Client[] = [
  {
    id: "1",
    name: "Andrzej",
    surname: "Asdf",
    email: "aasdf@example.com",
    created: "10.11.2023",
    modified: "11.11.2023",
    status: "active",
  },
  {
    id: "2",
    name: "Monika",
    surname: "Uiop",
    email: "auiop@example.com",
    created: "10.11.2023",
    modified: "11.11.2023",
    status: "active",
  },
  {
    id: "3",
    name: "Roman",
    surname: "Ipsum",
    email: "aipsum@example.com",
    created: "10.11.2023",
    modified: "11.11.2023",
    status: "active",
  },
  {
    id: "4",
    name: "Martyna",
    surname: "Qwerty",
    email: "aqwerty@example.com",
    created: "10.11.2023",
    modified: "11.11.2023",
    status: "injuried",
  },
];

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

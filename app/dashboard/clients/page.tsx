import { DataTable } from "@/components/ui/data-table";
import { Client, columns } from "./columns";

const clientsMock: Client[] = [
  {
    id: "1",
    name: "Andrzej",
    surname: "Asdf",
    email: "aasdf@example.com",
    added: "10.11.2023",
    status: "active",
  },
  {
    id: "2",
    name: "Monika",
    surname: "Uiop",
    email: "auiop@example.com",
    added: "10.11.2023",
    status: "active",
  },
  {
    id: "3",
    name: "Roman",
    surname: "Ipsum",
    email: "aipsum@example.com",
    added: "10.11.2023",
    status: "injuried",
  },
  {
    id: "4",
    name: "Martyna",
    surname: "Qwerty",
    email: "aqwerty@example.com",
    added: "10.11.2023",
    status: "injuried",
  },
];

export default async function Clients() {
  const data = clientsMock;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

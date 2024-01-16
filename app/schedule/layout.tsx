import { fetchClients } from "@/lib/data/clients";

import { ClientCombobox } from "./clientCombobox";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const clients = await fetchClients();

  return (
    <div className="flex flex-col">
      <ClientCombobox clients={clients} />
      {children}
    </div>
  );
};

export default Layout;

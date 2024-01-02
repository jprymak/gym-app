import { fetchClients } from "@/lib/data";
import { ClientCombobox } from "./clientCombobox";
import ProxyProvider from "@/lib/providers/ProxyProvider";
import { Suspense } from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const clients = await fetchClients();

  return (
    <div className="flex">
      <ClientCombobox clients={clients} />
      <Suspense fallback="Placeholder">
        <ProxyProvider>{children}</ProxyProvider>
      </Suspense>
    </div>
  );
};

export default Layout;

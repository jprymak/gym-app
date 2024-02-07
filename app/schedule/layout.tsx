import Link from "next/link";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchClients } from "@/lib/data/clients";

import { ClientCombobox } from "./clientCombobox";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const clients = await fetchClients();

  if (!clients.length) {
    return (
      <div className="mx-auto space-y-10">
        <span>You do not have any clients yet.</span>
        <Button variant="outline" className="flex gap-1">
          <UserPlus />
          <Link href="/clients">Create your first client</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow">
      <ClientCombobox clients={clients} />
      {children}
    </div>
  );
};

export default Layout;

export const dynamic = "force-dynamic";

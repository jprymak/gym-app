"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { ContextProvider } from "@/lib/context/globalContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <ContextProvider>
        <Sidebar />
        <div className="flex-1 p-4">
          <Header />
          <div className="mt-5">{children}</div>
        </div>
      </ContextProvider>
    </div>
  );
};

export default Layout;

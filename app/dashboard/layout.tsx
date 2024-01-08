"use client";

import Header from "../../components/header";
import Sidebar from "../../components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="border-r-2 p-4 min-h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 p-4">
        <Header />
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

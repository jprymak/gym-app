"use client";

import Sidebar from "../components/sidebar/sidebar";
import Header from "../components/header/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="bg-bg-secondary border border-bg-tertiary p-4 min-h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 p-4">
        <Header />
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

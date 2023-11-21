"use client";

import Sidebar from "../components/sidebar/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="bg-bg-secondary  p-5 min-h-screen">
        <Sidebar />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Layout;

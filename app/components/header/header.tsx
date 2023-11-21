"use client";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  return (
    <div className="bg-bg-secondary border border-bg-tertiary px-4 py-6 rounded-md text-xl capitalize">
      {pathname.split("/").pop()}
    </div>
  );
}

export default Header;

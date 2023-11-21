"use client";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  return <div className="">{pathname.split("/").pop()}</div>;
}

export default Header;

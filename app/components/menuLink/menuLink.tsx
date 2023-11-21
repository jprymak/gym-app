"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuLinkProps {
  item: any;
}

const MenuLink = ({ item }: MenuLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.path}
      className={`flex p-4 items-center gap-2 mx-0 my-1 rounded-md hover:bg-bg-tertiary ${
        pathname === item.path && "bg-bg-tertiary"
      }`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;

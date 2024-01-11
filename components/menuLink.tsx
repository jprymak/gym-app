"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface MenuLinkProps {
  item: {
    title: string;
    path: string;
    icon: JSX.Element;
  };
  handleClick?: () => void;
}

const MenuLink = ({ item, handleClick }: MenuLinkProps) => {
  const pathname = usePathname();
  const params = useParams();

  return (
    <Link
      onClick={handleClick}
      href={item.path}
      className={`flex p-3 items-center gap-2 mx-0 my-1 rounded-md hover:bg-muted ${
        (pathname === item.path ||
          pathname === `${item.path}/${params.clientId}`) &&
        "bg-muted"
      }`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;

"use client";

import { X } from "lucide-react";

import { menuItems } from "@/lib/constants/nav";
import { useGlobalContext } from "@/lib/context/globalContext";

import { Button } from "./ui/button";
import MenuLink from "./menuLink";

export const MobileNav = () => {
  const { isMobileNavOpen, toggleOpenMobileNav } = useGlobalContext();

  return (
    <section
      id="mobile-nav"
      className={`z-10 bg-primary-foreground absolute top-0 w-full p-4 flex flex-col border-b shadow-lg origin-top animate-open-menu ${
        !isMobileNavOpen ? "hidden" : ""
      }`}
    >
      <Button
        aria-label="close-menu"
        variant="ghost"
        className="self-end"
        onClick={toggleOpenMobileNav}
      >
        <X />
      </Button>
      <ul className="list-none flex flex-col h-full w-full">
        {menuItems.map((cat) => (
          <li key={cat.title} className="last-of-type:justify-self-end">
            <span className="font-bold text-sm my-2 mx-0">{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink
                item={item}
                key={item.title}
                handleClick={toggleOpenMobileNav}
              />
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
};

import Image from "next/image";
import { CalendarCheck, Dumbbell, Users, X } from "lucide-react";

import { useGlobalContext } from "@/lib/context/globalContext";

import { Button } from "./ui/button";
import MenuLink from "./menuLink";

const menuItems = [
  {
    title: "",
    list: [
      {
        title: "Clients",
        path: "/dashboard/clients",
        icon: <Users />,
      },
      {
        title: "Exercises",
        path: "/dashboard/exercises",
        icon: <Dumbbell />,
      },
      {
        title: "Schedule",
        path: "/dashboard/schedule",
        icon: <CalendarCheck />,
      },
    ],
  },
];

const Sidebar = () => {
  const { isMobileNavOpen, toggleOpenMobileNav } = useGlobalContext();

  return (
    <aside>
      <section className="hidden md:block p-4 h-full min-h-screen border-r-2 ">
        <div className="w-56 p-4 divide-y-2 border-2 rounded-md">
          <div className="flex items-center gap-5 mb-5 mx-2">
            <Image
              className="object-cover rounded-full"
              src="/noavatar.png"
              alt=""
              width="50"
              height="50"
            />
            <div className="flex flex-col mr-4">
              <span className="font-bold">John Doe</span>
              <span className="text-sm">Trainer</span>
            </div>
          </div>
          <ul className="list-none flex flex-col h-full w-full pt-6">
            {menuItems.map((cat) => (
              <li key={cat.title} className="last-of-type:justify-self-end">
                <span className="font-bold text-sm my-2 mx-0">{cat.title}</span>
                {cat.list.map((item) => (
                  <MenuLink item={item} key={item.title} />
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        id="mobile-nav"
        className={`z-10 bg-primary-foreground absolute top-0 w-full p-4 flex flex-col border-b shadow-lg origin-top animate-open-menu ${
          !isMobileNavOpen ? "hidden" : ""
        }`}
      >
        <Button
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
    </aside>
  );
};

export default Sidebar;

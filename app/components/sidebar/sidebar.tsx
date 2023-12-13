import Image from "next/image";
import MenuLink from "../menuLink/menuLink";
import { Users, Dumbbell, Settings, LayoutDashboard } from "lucide-react";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard />,
      },
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
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <Settings />,
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <div className="sticky rounded p-4 divide-y-2 top-10 border">
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
      <ul className="list-none flex flex-col h-full pt-6">
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
  );
};

export default Sidebar;

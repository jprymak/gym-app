import Image from "next/image";
import MenuLink from "../menuLink/menuLink";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { CgGym } from "react-icons/cg";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Trainees",
        path: "/dashboard/trainees",
        icon: <FaUsers />,
      },
      {
        title: "Exercises",
        path: "/dashboard/exercises",
        icon: <CgGym />,
      },
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <div className="sticky rounded p-4 divide-y-2 divide-bg-tertiary top-10 bg-bg-secondary border border-bg-tertiary">
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
          <span className="text-text-secondary text-sm">Trainer</span>
        </div>
      </div>
      <ul className="list-none flex flex-col h-full pt-6">
        {menuItems.map((cat) => (
          <li key={cat.title} className="last-of-type:justify-self-end">
            <span className="text-text-secondary font-bold text-sm my-2 mx-0">
              {cat.title}
            </span>
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

"use server";

import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { LogOut } from "lucide-react";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { menuItems } from "@/lib/constants/nav";

import MenuLink from "./menuLink";

export const Sidebar = async () => {
  const session = await getServerSession(options);

  return (
    <>
      {session ? (
        <aside className="hidden md:block p-4 pt-0 grow-1 ">
          <div className=" top-0 sticky pt-4">
            <section className="w-56 p-4 divide-y-2 border-2 rounded-md mb-4 ">
              <div className="flex items-center gap-5 mb-5 mx-2">
                <Image
                  className="object-cover rounded-full"
                  src="/noavatar.png"
                  alt=""
                  width="50"
                  height="50"
                />
                <div className="flex flex-col mr-4">
                  <span className="font-bold">{session?.user?.name}</span>
                  <span className="text-sm">Trainer</span>
                </div>
              </div>
              <ul className="list-none flex flex-col h-full w-full pt-6">
                {menuItems.map((cat) => (
                  <li key={cat.title} className="last-of-type:justify-self-end">
                    <span className="font-bold text-sm my-2 mx-0">
                      {cat.title}
                    </span>
                    {cat.list.map((item) => (
                      <MenuLink item={item} key={item.title} />
                    ))}
                  </li>
                ))}
              </ul>
            </section>
            <section className="w-56 p-4 divide-y-2 border-2 rounded-md">
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="flex p-3 items-center gap-2 mx-0 my-1 rounded-md hover:bg-muted"
              >
                <LogOut />
                Log out
              </Link>
            </section>
          </div>
        </aside>
      ) : null}
    </>
  );
};

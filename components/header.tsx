"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { LogIn, LogOut, Menu, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalContext } from "@/lib/context/globalContext";
import { getHeaderString } from "@/lib/helpers/stringHelpers";

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  const pathname = usePathname();
  const { toggleOpenMobileNav } = useGlobalContext();
  const { data: session } = useSession();

  return (
    <header className="border-2 px-4 py-3 rounded-md capitalize flex items-center gap-2">
      <h1 className=" text-2xl font-bold mr-auto">
        {getHeaderString(pathname)}
      </h1>
      <ModeToggle />
      {session && (
        <Button
          variant="outline"
          type="button"
          className="md:hidden"
          onClick={toggleOpenMobileNav}
        >
          <Menu />
        </Button>
      )}
      <Button asChild variant="outline" type="button" className="md:hidden">
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">
            <LogOut />
          </Link>
        ) : (
          <Link href="/api/auth/signin">
            <LogIn />
          </Link>
        )}
      </Button>
    </header>
  );
}

export default Header;

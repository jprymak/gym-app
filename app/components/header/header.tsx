"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";

function Header() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="border px-4 py-6 rounded-md capitalize flex items-center">
      <h1 className="text-lg mr-auto">{pathname.split("/").pop()}</h1>
      <div className="flex gap-2">
        {isDark ? <Sun /> : <Moon />}
        <Switch
          checked={isDark}
          onCheckedChange={() =>
            isDark ? setTheme("light") : setTheme("dark")
          }
        />
      </div>
    </header>
  );
}

export default Header;

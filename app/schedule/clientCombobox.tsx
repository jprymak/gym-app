"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Client } from "@prisma/client";

interface ClientComboboxProps {
  clients: Client[];
}

export function ClientCombobox({ clients }: ClientComboboxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    () =>
      clients.find((client) => client.id === pathname.split("/").pop())?.id ||
      ""
  );

  useEffect(() => {
    //resets combobox value if schedule in nav is clicked
    setValue(
      clients.find((client) => client.id === pathname.split("/").pop())?.id ||
        ""
    );
  }, [pathname, clients]);

  const onSelect = (currentValue: string) => {
    const valueToSet = currentValue === value ? "" : currentValue;
    setValue(valueToSet);
    router.push(`/schedule/${valueToSet}`);
    setOpen(false);
  };

  const label = value
    ? clients.find((client) => client.id === value)?.name
    : "Select client...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="mb-5" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            const client = clients.find((client) => client.id === value);
            return client?.name.toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0;
          }}
        >
          <CommandInput placeholder="Search clients..." />
          <CommandEmpty>No exercise found.</CommandEmpty>
          <CommandGroup>
            {clients.map((client) => {
              return (
                <CommandItem
                  key={client.id}
                  value={client.id}
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {client.name}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

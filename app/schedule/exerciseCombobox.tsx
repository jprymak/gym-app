import { useMemo, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CellContext } from "@tanstack/react-table";

export function ExerciseCombobox({
  getValue,
  row,
  column: { id },
  table,
}: CellContext<any, unknown>) {
  const [open, setOpen] = useState(false);
  const exercises = useMemo(() => {
    return table.options.meta?.getExercises() || [];
  }, [table.options.meta]);

  const [value, setValue] = useState(
    () => exercises.find((exercise) => exercise.id === getValue())?.name || ""
  );

  const onSelect = (currentValue: string) => {
    const valueToSet = currentValue === value ? "" : currentValue;
    setValue(valueToSet);
    const selectedExercise = exercises.find(
      (exercise) => exercise.name.toLowerCase() === valueToSet.toLowerCase()
    )?.id;

    if (selectedExercise) {
      table.options.meta?.updateData(row.original.id, id, selectedExercise);
    } else {
      table.options.meta?.updateData(row.original.id, id, "");
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`min-w-[255px] justify-between ${
            !value && "text-white bg-destructive "
          }`}
        >
          {value
            ? exercises.find(
                (exercise) =>
                  value.toLowerCase() === exercise.name.toLowerCase()
              )?.name
            : "Select exercise..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[255px] p-0 ">
        <ScrollArea className="max-h-48 overflow-auto">
          <Command>
            <CommandInput placeholder="Search exercises..." />
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup>
              {exercises.map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  value={exercise.name}
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === exercise.name.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {exercise.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

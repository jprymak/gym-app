import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { useMemo, useState } from "react";
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
          className={`w-[200px] justify-between ${
            !value && "text-white bg-destructive"
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
      <PopoverContent className="w-[200px] p-0">
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
      </PopoverContent>
    </Popover>
  );
}

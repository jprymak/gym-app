"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { SubmitBtn } from "@/components/submitBtn";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { createExercise, updateExercise } from "@/lib/data/exercises";
import { zodResolver } from "@hookform/resolvers/zod";

import { Exercise, MUSCLE_GROUPS } from "./columns";

export const exerciseFormMessages = {
  nameMinError: "Exercise name must be at least 4 characters long.",
  nameMaxError: "Exercise name cannot contain more than 20 characters",
  muscleGroupsError: "At least one muscle group must be selected",
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Exercise name must be at least 4 characters long.",
    })
    .max(25, {
      message: "Exercise name cannot contain more than 20 characters",
    }),
  muscleGroups: z.array(z.string()).min(1, {
    message: "At least one muscle group must be selected",
  }),
  demoLink: z.string().url().or(z.literal("")),
});

interface ExerciseFormProps {
  data?: Exercise;
  closeDialog: () => void;
}

export function ExerciseForm({ data, closeDialog }: ExerciseFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          name: data.name,
          muscleGroups: data.muscleGroups,
          demoLink: data.demoLink,
        }
      : {
          name: "",
          muscleGroups: [],
          demoLink: "",
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = data
        ? await updateExercise(values, data.id)
        : await createExercise(values);

      if ("error" in result) {
        toast({
          variant: "destructive",
          title: result.error,
        });
      } else {
        toast({
          title: data ? "Exercise was updated." : "Exercise was created.",
        });
        closeDialog();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input placeholder="Exercise name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="muscleGroups"
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormLabel>Muscle Groups</FormLabel>
              <FormControl>
                <MultiSelect
                  onChange={onChange}
                  options={MUSCLE_GROUPS}
                  placeholder={"Select muscle groups..."}
                  value={value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="demoLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo link</FormLabel>
              <FormControl>
                <Input placeholder="Demo link (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitBtn isPending={isPending} />
      </form>
    </Form>
  );
}

interface MultiSelectProps {
  onChange: (...event: any[]) => void;
  options: string[];
  placeholder: string;
  value: string[];
}

export function MultiSelect({
  onChange,
  options,
  placeholder,
  value,
}: MultiSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  const handleUnselect = useCallback((option: string) => {
    setSelected((prev) => prev.filter((s) => s !== option));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = options.filter((option) => !selected.includes(option));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option) => {
            return (
              <Badge key={option} variant="secondary">
                {option}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, option]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}

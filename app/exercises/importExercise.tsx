import { useTransition } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { read, utils } from "xlsx";
import { z } from "zod";

import { PendingBtn } from "@/components/pendingBtn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { bulkCreateExercise } from "@/lib/data/exercises";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE = 1024000;
const ACCEPTED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const formSchema = z.object({
  file: z
    .custom<File>((file) => file, "Required")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size should be less than 1mb.`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only these types are allowed .xls, .xlsx"
    ),
});

interface ImportExerciseProps {
  closeDialog: () => void;
}

export const ImportExercise = ({ closeDialog }: ImportExerciseProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!values) return;
      const data = await values.file.arrayBuffer();

      const workbook = read(data);

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = utils.sheet_to_json(worksheet) as {
        exercise: string;
        link: string;
      }[];

      const result = await bulkCreateExercise(jsonData);

      if ("error" in result) {
        toast({
          variant: "destructive",
          title: result.error,
        });
      } else {
        toast({
          title: "Exercises were imported.",
        });
        closeDialog();
      }
    });
  }

  return (
    <div className="flex flex-col">
      <h4 className="font-semibold">Import rules</h4>
      <Accordion type="single" collapsible className="mb-5">
        <AccordionItem value="item-1">
          <AccordionTrigger>Fields</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-outside pl-5">
              <li>Exercise name =&gt; header name = exercise</li>
              <li>Demo =&gt; header name = link</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Limits</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-outside pl-5">
              <li>
                Exercise name cannot be more than 40 characters long. Extra
                characters above that value will be truncated.
              </li>
              <li>
                Links that do not start with &apos;https://www.youtube.com&apos;
                or &apos;https://youtu.be&apos; are ignored
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Example</AccordionTrigger>
          <AccordionContent>
            <Image
              width="500"
              height="50"
              alt="Import exercise example"
              src="/import-example.png"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange }, ...field }) => (
              <FormItem>
                <FormLabel>File to import</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...field}
                    onChange={(event) => {
                      const target = event.target as HTMLInputElement & {
                        files: FileList;
                      };
                      onChange(target.files[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PendingBtn
            label="Submit"
            pendingLabel="Pending..."
            isPending={isPending}
          />
        </form>
      </Form>
    </div>
  );
};

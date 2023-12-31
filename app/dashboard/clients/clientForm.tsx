"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Client } from "./columns";
import { toast } from "@/components/ui/use-toast";
import { addClient, updateClient } from "@/lib/data";
import { SubmitBtn } from "@/components/submitBtn";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  surname: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Email is not valid.",
  }),
  status: z.string().min(2, {
    message: "Status must be at least 2 characters.",
  }),
});

interface ClientFormProps {
  data?: Client;
  closeDialog: () => void;
}

export function ClientForm({ data, closeDialog }: ClientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          name: data.name,
          surname: data.surname,
          email: data.email,
          status: data.status,
        }
      : {
          name: "",
          surname: "",
          email: "",
          status: "",
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = data
      ? await updateClient(values, data.id)
      : await addClient(values);

    if ("error" in result) {
      toast({
        variant: "destructive",
        title: result.error,
      });
    } else {
      toast({
        title: data ? "Client was updated." : "Client was created.",
      });
      closeDialog();
    }
  }

  return (
    <Form {...form}>
      <form action={() => onSubmit(form.getValues())} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="User name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input placeholder="User surname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="User email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="inactive">inactive</SelectItem>
                  <SelectItem value="injured">injured</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitBtn />
      </form>
    </Form>
  );
}

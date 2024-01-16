"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { SubmitBtn } from "@/components/submitBtn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { addClient, updateClient } from "@/lib/data/clients";
import { zodResolver } from "@hookform/resolvers/zod";

import { Client } from "./columns";

export const clientFormMessages = {
  nameMinError: "Name must be at least 2 characters long.",
  nameMaxError: "Name cannot contain more than 20 characters.",
  surnameMinError: "Surname must be at least 2 characters long.",
  surnameMaxError: "Surname cannot contain more than 20 characters",
  emailError: "Email is invalid.",
  statusError: "Status must be selected before submitting.",
};

export const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: clientFormMessages.nameMinError,
    })
    .max(20, {
      message: clientFormMessages.nameMaxError,
    }),

  surname: z
    .string()
    .min(2, {
      message: clientFormMessages.surnameMinError,
    })
    .max(20, {
      message: clientFormMessages.surnameMaxError,
    }),

  email: z.string().email({
    message: clientFormMessages.emailError,
  }),
  status: z.string().min(2, {
    message: clientFormMessages.statusError,
  }),
});

interface ClientFormProps {
  data?: Client;
  closeDialog: () => void;
}

export function ClientForm({ data, closeDialog }: ClientFormProps) {
  const [isPending, startTransition] = useTransition();

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
    startTransition(async () => {
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
        <SubmitBtn isPending={isPending} />
      </form>
    </Form>
  );
}

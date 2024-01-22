"use client";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { PendingBtn } from "@/components/pendingBtn";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUser } from "@/lib/data/users";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "./ui/use-toast";

const formSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .regex(
        new RegExp(".*[A-Z].*"),
        "Must contain at least one uppercase character"
      )
      .regex(
        new RegExp(".*[a-z].*"),
        "Must contain at least one lowercase character"
      )
      .regex(new RegExp(".*\\d.*"), "One number")
      .regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "Must contain at least one special character"
      )
      .min(8, "Must be at least 8 characters in length"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function UserForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await createUser(values);
      if ("error" in result) {
        toast({
          variant: "destructive",
          title: result.error,
        });
      } else {
        toast({
          title: "User was created.",
        });
        router.push("/");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="User password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 self-end">
          <PendingBtn
            pendingLabel="Submitting..."
            label="Submit"
            isPending={isPending}
          />
          <Button variant="outline" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

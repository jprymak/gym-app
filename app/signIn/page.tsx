"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { GoogleIcon } from "@/components/customIcons/googleIcon";
import { PendingBtn } from "@/components/pendingBtn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { revalidateServerSide } from "@/lib/helpers/cache";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function SignInForm() {
  const { get } = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Invalid credentials",
        });
      } else if (result?.url) {
        await revalidateServerSide(result?.url);
        const callbackUrl = get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl);
        }
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
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
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 self-end">
          <PendingBtn
            pendingLabel="Pending..."
            label="Sign In"
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

const SignInPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { get } = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleOAuthSignIn = (provider: "github" | "google") => {
    const callbackUrl = get("callbackUrl");
    signIn(provider, { callbackUrl: callbackUrl || "/" });
  };

  return (
    <Dialog open onOpenChange={() => router.push("/")}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <SignInForm />
        <Separator />
        <div className="flex justify-around">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            type="button"
            className="flex gap-1"
          >
            <Github /> With Github
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            type="button"
            className="flex gap-1"
          >
            <GoogleIcon />
            With Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPage;

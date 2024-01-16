"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { PendingBtn } from "@/components/pendingBtn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SignOutPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onConfirm() {
    startTransition(async () => {
      await signOut({
        callbackUrl: "",
      });
    });
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent
        onInteractOutside={() => {
          () => router.back();
        }}
      >
        <DialogHeader>
          <DialogTitle>Sign out</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to sign out?</p>
        <div className="flex gap-2 justify-end">
          <PendingBtn
            label="Confirm"
            pendingLabel="Logging out..."
            onClick={onConfirm}
            isPending={isPending}
          />
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutPage;

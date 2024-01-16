import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";
interface PendingBtnProps {
  isPending: boolean;
  label: string;
  pendingLabel: string;
  onClick?: () => void;
}

export const PendingBtn = ({
  isPending,
  label,
  pendingLabel,
  onClick,
}: PendingBtnProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      type="submit"
      className=" flex gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          {pendingLabel}
        </>
      ) : (
        <>{label}</>
      )}
    </Button>
  );
};

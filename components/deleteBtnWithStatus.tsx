import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";

interface DeleteBtnProps extends React.HTMLAttributes<HTMLButtonElement> {
  isPending: boolean;
}

export const DeleteBtnWithStatus = ({
  isPending,
  ...props
}: DeleteBtnProps) => {
  return (
    <Button
      disabled={isPending}
      variant="destructive"
      className=" flex gap-2"
      {...props}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Deleting...
        </>
      ) : (
        <>Delete</>
      )}
    </Button>
  );
};

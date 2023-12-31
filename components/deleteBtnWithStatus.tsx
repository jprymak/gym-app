import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface DeleteBtnProps {
  onClick: () => Promise<void>;
  isPending: boolean;
}

export const DeleteBtnWithStatus = ({ onClick, isPending }: DeleteBtnProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      variant="destructive"
      className=" flex gap-2"
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

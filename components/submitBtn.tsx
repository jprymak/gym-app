import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";
interface SubmitBtnProps {
  isPending: boolean;
}

export const SubmitBtn = ({ isPending }: SubmitBtnProps) => {
  return (
    <Button disabled={isPending} type="submit" className=" flex gap-2">
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Submitting
        </>
      ) : (
        <>Submit</>
      )}
    </Button>
  );
};

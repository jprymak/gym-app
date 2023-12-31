import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

export const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" className=" flex gap-2">
      {pending ? (
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

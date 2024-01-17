import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center flex-grow flex-1">
      <Loader2 width={100} height={100} className="animate-spin" />
    </div>
  );
}

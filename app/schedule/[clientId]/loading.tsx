import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <span className="flex items-center justify-center">
        <Loader2 width={100} height={100} className="animate-spin" />
      </span>
    </div>
  );
}

import { Button, ButtonProps } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface IconButtonProps extends ButtonProps {
  tooltip: string;
  icon: React.ReactNode;
  label?: string;
}

export const IconButton = ({
  tooltip,
  icon,
  label = "",
  ...props
}: IconButtonProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="flex gap-2" {...props}>
            {icon}
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent asChild>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

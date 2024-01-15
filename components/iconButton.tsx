import React from "react";

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

const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & IconButtonProps
>(({ tooltip, icon, label = "", ...props }, ref) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button
            aria-label={tooltip}
            className="flex gap-2"
            {...props}
            ref={ref}
          >
            {icon}
            {label}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
));
IconButton.displayName = "IconButton";

export { IconButton };

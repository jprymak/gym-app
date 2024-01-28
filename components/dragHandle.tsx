import { GripVertical } from "lucide-react";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface DragHandleProps {
  isDragging?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
}

export const DragHandle = (props: DragHandleProps) => {
  return (
    <div
      className={`${props.isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      aria-label="drag-handle"
      {...props}
    >
      <GripVertical />
    </div>
  );
};

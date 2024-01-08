import { GripVertical } from "lucide-react";

import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface DragHandleProps {
  isDragging?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
}

export const DragHandle = (props: DragHandleProps) => {
  return (
    <div
      className={`${props.isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      {...props}
    >
      <GripVertical />
    </div>
  );
};

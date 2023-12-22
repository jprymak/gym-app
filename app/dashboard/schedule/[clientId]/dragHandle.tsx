import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripVertical } from "lucide-react";

interface DragHandleProps {
  isDragging?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
}

export const DragHandle = (props: DragHandleProps) => {
  return (
    <div
      className={`h-2 mr-1 flex items-center ${
        props.isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      {...props}
    >
      <GripVertical />
    </div>
  );
};

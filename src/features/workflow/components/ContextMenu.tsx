import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { createNode, validateNodes } from "../utils/nodes.utils";
import { useEditNode } from "../state/use-edit-node";
import { Button } from "@/components/ui/button";

interface ContextMenuProps {
  x: number;
  y: number;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y }) => {
  const nodeId = useEditNode((state) => state.nodeId);
  const setOpen = useEditNode((state) => state.setOpen);
  const { getNode, setNodes, setEdges, getEdges } = useReactFlow();

  // get the node label and position to duplicate the node

  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId ?? "");
    const position = {
      x: (node?.position.x ?? 0) + 50,
      y: (node?.position.y ?? 0) + 50,
    };
    const newNode = createNode(node?.data.label as string, position);
    setNodes((prevNodeState) =>
      validateNodes(prevNodeState.concat(newNode), getEdges())
    );
  }, [nodeId, getNode, setNodes]);

  // remove the node with edge
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
  }, [nodeId, setNodes, setEdges]);

  // invoke the edit node sheet
  const editNodeFormOpener = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <Popover open>
      <PopoverTrigger
        className="absolute"
        style={{ top: y, left: x }}
      ></PopoverTrigger>
      <PopoverContent className="w-50 p-2">
        <div className="flex flex-col gap-3">
          {[
            { name: "duplicate", fn: duplicateNode },
            { name: "edit", fn: editNodeFormOpener },
            { name: "delete", fn: deleteNode },
          ].map(({ name, fn }) => (
            <Button
              key={name}
              className="p-2 text-md text-start"
              onClick={fn}
              variant={"secondary"}
            >
              {name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ContextMenu;
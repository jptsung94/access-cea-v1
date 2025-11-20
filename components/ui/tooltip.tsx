"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider data-node-id="unknown_4f667593"
    data-slot="tooltip-provider"
    delayDuration={delayDuration}
    {...props} />);


}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider data-node-id="tooltipprovider_53caa2a4">
      <TooltipPrimitive.Root data-node-id="unknown_96a16a60" data-slot="tooltip" {...props} />
    </TooltipProvider>);

}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-node-id="unknown_344bcea7" data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal data-node-id="unknown_379c5ce1">
      <TooltipPrimitive.Content data-node-id="unknown_765e5d7a"
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      )}
      {...props}>

        <span data-node-id="span_4cc0a384" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span>
        <TooltipPrimitive.Arrow data-node-id="unknown_67ac6722" className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>);

}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
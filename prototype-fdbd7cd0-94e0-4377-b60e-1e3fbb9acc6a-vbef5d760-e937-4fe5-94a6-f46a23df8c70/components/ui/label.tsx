"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import type React from "react";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root data-node-id="unknown_6a6ded98"
    data-slot="label"
    className={cn(
      "text-sm font-medium text-foreground leading-none select-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props} />);


}

export { Label };
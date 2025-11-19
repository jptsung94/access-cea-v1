import type React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-node-id="div_7a767d4b"
    data-slot="skeleton"
    className={cn("bg-accent animate-pulse rounded-md", className)}
    {...props} />);


}

export { Skeleton };
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default:
        "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
        "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        outline:
        "border border-input bg-white shadow-sm hover:bg-gray-50 text-foreground",
        secondary:
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
        "hover:bg-gray-100 text-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props




}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {asChild?: boolean;}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp data-node-id="comp_7a0de716"
    data-slot="button"
    className={cn(buttonVariants({ variant, size, className }))}
    {...props} />);


}

export { Button, buttonVariants };
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badge_variants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
        "border-transparent bg-primary text-primary-foreground",
        secondary:
        "border-transparent bg-gray-100 text-gray-700",
        destructive:
        "border-transparent bg-gray-100 text-gray-700",
        outline: "text-foreground border-border"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
VariantProps<typeof badge_variants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div data-node-id="div_893c0486" className={cn(badge_variants({ variant }), className)} {...props} />);

}

export { Badge, badge_variants };
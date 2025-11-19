import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
  ({ className, ...props }, ref) =>
  <CheckboxPrimitive.Root data-node-id="unknown_8c11c62a"
  ref={ref}
  className={cn(
    "peer h-[18px] w-[18px] shrink-0 rounded border-2 border-input bg-white shadow-sm",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
    className
  )}
  {...props}>

    <CheckboxPrimitive.Indicator data-node-id="unknown_3a81adad"
    className={cn("flex items-center justify-center text-current")}>

      <Check data-node-id="check_ddadbec3" className="h-3.5 w-3.5 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
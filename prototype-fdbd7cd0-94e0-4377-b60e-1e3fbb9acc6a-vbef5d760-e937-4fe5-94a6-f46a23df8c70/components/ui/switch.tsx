"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label data-node-id="label_75c4d310"
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-sm",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-0",
        checked ? "bg-foreground" : "bg-gray-200",
        disabled ?
        "cursor-not-allowed opacity-50 pointer-events-none" :
        "cursor-pointer"
      )}>

        <input data-node-id="input_56b83745"
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
        ref={ref}
        disabled={disabled}
        {...props} />

        <span data-node-id="span_6fec6f18"
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )} />

      </label>);

  }
);

Switch.displayName = "Switch";

export { Switch };
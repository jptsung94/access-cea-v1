import type React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  description?: string;
  rightAdornment?: string;
}

function Input({ className, type, description, rightAdornment, ...props }: InputProps) {
  const inputElement =
  <input data-node-id="input_ff85a9f5"
  type={type}
  data-slot="input"
  className={cn(
    "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground",
    "placeholder:text-gray-400",
    "transition-colors duration-150",
    "hover:border-gray-400",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "shadow-sm",
    rightAdornment && "pr-12",
    className
  )}
  {...props} />;



  if (rightAdornment || description) {
    return (
      <div data-node-id="div_893c0486" className="space-y-1">
        {rightAdornment ?
        <div data-node-id="div_c7729b52" className="relative">
            <span data-node-id="span_4e1581e1" data-text-id="inputelement_cd443811" data-editable="variable" data-variable-name="inputElement" className="protoforge-editable-text">{inputElement}</span>
            <div data-node-id="div_def54d12" className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span data-node-id="span_0e1d4631" className="text-sm text-gray-500"><span data-node-id="span_e9cd6766" data-text-id="rightadornme_f47a5ea8" data-editable="variable" data-variable-name="rightAdornment" className="protoforge-editable-text">{rightAdornment}</span></span>
            </div>
          </div> :

        inputElement
        }
        {description &&
        <p data-node-id="p_a9b3a873" className="text-xs text-gray-500"><span data-node-id="span_cf1d28b0" data-text-id="description_cbc34128" data-editable="variable" data-variable-name="description" className="protoforge-editable-text">{description}</span></p>
        }
      </div>);

  }

  return inputElement;
}

export { Input };
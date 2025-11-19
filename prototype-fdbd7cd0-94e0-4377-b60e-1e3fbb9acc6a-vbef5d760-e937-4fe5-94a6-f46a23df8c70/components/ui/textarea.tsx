import type * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  description?: string;
}

function Textarea({ className, description, ...props }: TextareaProps) {
  const textareaElement =
  <textarea data-node-id="textarea_129c1a0f"
  data-slot="textarea"
  className={cn(
    "flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground",
    "placeholder:text-gray-400",
    "transition-colors duration-150",
    "hover:border-gray-400",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "shadow-sm resize-none",
    className
  )}
  {...props} />;



  if (description) {
    return (
      <div data-node-id="div_67036f83" className="space-y-1">
        <span data-node-id="span_347abed9" data-text-id="textareaelem_1eaa8b94" data-editable="variable" data-variable-name="textareaElement" className="protoforge-editable-text">{textareaElement}</span>
        <p data-node-id="p_811b4bd0" className="text-xs text-gray-500"><span data-node-id="span_158cd9dd" data-text-id="description_cbc34128" data-editable="variable" data-variable-name="description" className="protoforge-editable-text">{description}</span></p>
      </div>);

  }

  return textareaElement;
}

export { Textarea };
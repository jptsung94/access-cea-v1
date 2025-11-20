"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-node-id="unknown_51b65978" data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-node-id="unknown_a3202ae8" data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-node-id="unknown_40ffd136" data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger data-node-id="unknown_7d96d31e"
    data-slot="select-trigger"
    className={cn(
      "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm",
      "placeholder:text-gray-400",
      "transition-colors duration-150",
      "hover:border-gray-400",
      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "[&>span]:line-clamp-1",
      className
    )}
    {...props}>

      <span data-node-id="span_618a829c" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span>
      <SelectPrimitive.Icon data-node-id="unknown_b47e8f4a" asChild>
        <ChevronDownIcon data-node-id="chevrondownicon_344dad41" className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>);

}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal data-node-id="unknown_379c5ce1">
      <SelectPrimitive.Content data-node-id="unknown_7d7849af"
      data-slot="select-content"
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}>

        <SelectScrollUpButton data-node-id="selectscrollupbutton_35d8b8ca" />
        <SelectPrimitive.Viewport data-node-id="unknown_900a0536"
        className={cn(
          "p-1",
          position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}>

          <span data-node-id="span_c581f87f" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span>
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton data-node-id="selectscrolldownbutton_a4ce5948" />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>);

}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label data-node-id="unknown_83dd4b83"
    data-slot="select-label"
    className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
    {...props} />);


}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item data-node-id="unknown_ee8536fd"
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
      "hover:bg-gray-100 focus:bg-gray-100",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>

      <span data-node-id="span_afc807f1" className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator data-node-id="unknown_98b5f6c9">
          <CheckIcon data-node-id="checkicon_ca8e1a5c" className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText data-node-id="unknown_e3a04023"><span data-node-id="span_ac924611" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span></SelectPrimitive.ItemText>
    </SelectPrimitive.Item>);

}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator data-node-id="unknown_b78c8385"
    data-slot="select-separator"
    className={cn("bg-border -mx-1 my-1 h-px", className)}
    {...props} />);


}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton data-node-id="unknown_e759566b"
    data-slot="select-scroll-up-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}>

      <ChevronUpIcon data-node-id="chevronupicon_8585b4a2" className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>);

}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton data-node-id="unknown_0ec53ee9"
    data-slot="select-scroll-down-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}>

      <ChevronDownIcon data-node-id="chevrondownicon_4ccbae11" className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>);

}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue };
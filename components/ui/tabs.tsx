"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
} | null>(null);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className
}: TabsProps) {
  const [selectedTab, setSelectedTab] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider data-node-id="unknown_4ec7502e"
    value={{ selectedTab, setSelectedTab: handleTabChange }}>

      <div data-node-id="div_0e58fa71" className={cn("w-full", className)}><span data-node-id="span_2f28eba9" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span></div>
    </TabsContext.Provider>);

}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return <div data-node-id="div_d99e234a" className={cn("flex items-center", className)}><span data-node-id="span_cfe8d23a" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span></div>;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  variant?: "underline" | "segment";
}

export function TabsTrigger({
  value,
  children,
  className,
  variant = "underline"
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isSelected = context.selectedTab === value;

  return (
    <button data-node-id="button_c6e487b0"
    type="button"
    className={cn(
      "flex-shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variant === "underline" && "px-2 py-1 text-sm",
      variant === "segment" && "px-4 py-2 text-[15px] rounded-xl",
      isSelected ?
      variant === "underline" ?
      "text-foreground border-b-2 border-b-black font-semibold" :
      "bg-background font-medium shadow text-foreground" :
      variant === "underline" ?
      "text-muted-foreground hover:text-foreground" :
      "text-muted-foreground",
      className
    )}
    onClick={() => context.setSelectedTab(value)}>

      <span data-node-id="span_2142e92f" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span>
    </button>);

}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  if (context.selectedTab !== value) {
    return null;
  }

  return (
    <div data-node-id="div_4047c06c"
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}>

      <span data-node-id="span_5c1f92e6" data-text-id="children_22d16141" data-editable="variable" data-variable-name="children" className="protoforge-editable-text">{children}</span>
    </div>);

}
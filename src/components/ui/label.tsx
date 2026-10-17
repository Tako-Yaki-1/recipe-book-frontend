import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode; error?: boolean | string };
export function Label({ className, children, error, ...props }: LabelProps) {
  return <label className={cn("mb-1.5 block text-sm font-semibold", error ? "text-tomato" : "text-ink", className)} {...props}>{children}</label>;
}

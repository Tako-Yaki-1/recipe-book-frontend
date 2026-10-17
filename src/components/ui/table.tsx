import type { TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <div className="overflow-x-auto"><table className={cn("w-full min-w-176 text-left text-sm [&_th]:py-3 [&_th]:pr-6 [&_th]:font-semibold [&_td]:py-4 [&_td]:pr-6 [&_thead]:border-b-2 [&_thead]:border-ink [&_tbody_tr]:border-b [&_tbody_tr]:border-ink/15", className)} {...props} /></div>;
}

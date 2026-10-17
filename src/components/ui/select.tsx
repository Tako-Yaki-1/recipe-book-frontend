import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <div>
      <select
        className={cn("w-full rounded-md border bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-towel focus:ring-2 focus:ring-towel/30", error ? "border-tomato" : "border-ink/55", className)}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-tomato">{error}</p>}
    </div>
  );
}

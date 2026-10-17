import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input className={cn("w-full rounded-md border bg-white px-3 py-2.5 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/50 focus:border-towel focus:ring-2 focus:ring-towel/30", error ? "border-tomato" : "border-ink/55", className)} aria-invalid={error ? true : undefined} {...props} />
      {error && <p className="mt-1 text-sm text-tomato">{error}</p>}
    </div>
  );
}

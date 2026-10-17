import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea className={cn("w-full rounded-md border bg-white px-3 py-2.5 text-base text-ink outline-none placeholder:text-ink/50 focus:border-towel focus:ring-2 focus:ring-towel/30", error ? "border-tomato" : "border-ink/55", className)} aria-invalid={error ? true : undefined} {...props} />
      {error && <p className="mt-1 text-sm text-tomato">{error}</p>}
    </div>
  );
}

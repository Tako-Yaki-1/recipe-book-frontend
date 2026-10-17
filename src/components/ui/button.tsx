import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  children: ReactNode;
};

const variants = {
  primary: "bg-towel text-white hover:bg-towel-deep",
  secondary: "border border-towel text-towel hover:bg-glaze",
  tertiary: "text-towel underline underline-offset-4 hover:text-ink",
  danger: "border border-tomato/50 text-tomato hover:bg-tomato hover:text-white",
};

export function Button({ variant = "primary", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn("inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-[background-color,color,transform] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-towel disabled:cursor-not-allowed disabled:opacity-60", variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

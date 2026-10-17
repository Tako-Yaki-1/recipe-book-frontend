import type { ReactNode } from "react";
import { Link } from "react-router";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

// Top bar with the app name and account actions, the towel stripe, then the page title.
// Optional children provide actions such as Sign out.
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <Link to="/" className="text-lg font-bold tracking-tight">Recipe Book</Link>
        {children}
      </div>
      <div aria-hidden="true" className="towel-rule text-towel" />
      <div className="pt-10 pb-8 sm:pt-14">
        <h1 className="text-4xl leading-none font-bold tracking-tight sm:text-6xl">{title}</h1>
        {description && <p className="mt-4 max-w-prose text-base text-ink/70">{description}</p>}
      </div>
    </header>
  );
}

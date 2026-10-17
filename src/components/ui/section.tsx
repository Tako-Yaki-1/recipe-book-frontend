import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
};

export function Section({ children }: SectionProps) {
  // Shared page width and responsive padding keep every screen aligned.
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {children}
    </section>
  );
}

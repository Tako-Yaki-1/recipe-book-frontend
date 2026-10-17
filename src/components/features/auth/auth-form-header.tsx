type AuthFormHeaderProps = {
  title: string;
  description: string;
};

// Reuse the same heading style while each auth page supplies its own text.
export function AuthFormHeader({ title, description }: AuthFormHeaderProps) {
  return (
    <header>
      <h2 className="text-4xl font-bold tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-base text-ink/70">
        {description}
      </p>
    </header>
  );
}

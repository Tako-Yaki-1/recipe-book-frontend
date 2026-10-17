import { cn } from "@/lib/cn";

// Easy fills one dot, Medium two, Hard three. The word is always shown next to the dots.
export function Difficulty({ level }: { level: string }) {
  const filled = level === "Hard" ? 3 : level === "Medium" ? 2 : 1;

  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3].map((dot) => (
          <span key={dot} className={cn("size-2 rounded-full border border-towel", dot <= filled && "bg-towel")} />
        ))}
      </span>
      {level}
    </span>
  );
}

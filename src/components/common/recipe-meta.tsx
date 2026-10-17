import { Difficulty } from "@/components/common/difficulty";

type RecipeMetaProps = {
  cuisine: string;
  mealType: string[];
  difficulty: string;
  cookTimeMinutes: number;
  compact?: boolean;
};

// Compact: values only, for recipe cards. Full: labeled rows, for the details page.
export default function RecipeMeta({ cuisine, mealType, difficulty, cookTimeMinutes, compact = false }: RecipeMetaProps) {
  if (compact) {
    return (
      <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <div><dt className="sr-only">Cook time</dt><dd className="font-semibold">{cookTimeMinutes} min</dd></div>
        <div><dt className="sr-only">Difficulty</dt><dd><Difficulty level={difficulty} /></dd></div>
        <div><dt className="sr-only">Cuisine</dt><dd>{cuisine}</dd></div>
        <div><dt className="sr-only">Meal type</dt><dd className="text-ink/70">{mealType.join(", ")}</dd></div>
      </dl>
    );
  }

  return (
    <dl className="divide-y divide-ink/15 border-y border-ink/15 text-base">
      <div className="flex justify-between gap-6 py-3"><dt className="text-ink/70">Cuisine</dt><dd className="text-right font-medium">{cuisine}</dd></div>
      <div className="flex justify-between gap-6 py-3"><dt className="text-ink/70">Meal type</dt><dd className="text-right font-medium">{mealType.join(", ")}</dd></div>
      <div className="flex justify-between gap-6 py-3"><dt className="text-ink/70">Difficulty</dt><dd className="font-medium"><Difficulty level={difficulty} /></dd></div>
      <div className="flex justify-between gap-6 py-3"><dt className="text-ink/70">Cook time</dt><dd className="text-right font-medium">{cookTimeMinutes} min</dd></div>
    </dl>
  );
}

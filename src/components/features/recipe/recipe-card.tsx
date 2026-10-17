import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import RecipeMeta from "@/components/common/recipe-meta";

type RecipeCardProps = {
  id: string;
  image: string;
  name: string;
  cuisine: string;
  mealType: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  cookTimeMinutes: number;
  tags: string[];
  onDelete: (id: string) => void;
};

export default function RecipeCard({id, image, name, cuisine, mealType, difficulty, cookTimeMinutes, tags, onDelete}: RecipeCardProps) {
  return (
    <article className="flex h-full flex-col">
      {/* The photo and the title go to the same place, so only the title is announced to screen readers. */}
      <Link to={`/recipe/${id}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-sm bg-glaze">
        <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
      </Link>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <h3 className="text-2xl leading-tight font-bold tracking-tight">
          <Link to={`/recipe/${id}`} className="underline-offset-4 hover:underline">{name}</Link>
        </h3>

        <RecipeMeta
          compact
          cuisine={cuisine}
          mealType={mealType}
          difficulty={difficulty}
          cookTimeMinutes={cookTimeMinutes}
        />

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <Button variant="danger" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

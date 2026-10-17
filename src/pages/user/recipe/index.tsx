import { Link, useParams } from "react-router";
import { Section } from "@/components/ui/section";
import { RecipeDetails } from "@/components/features/recipe/recipe-details";

export default function RecipePage() {
  const { id } = useParams();

  // The page reads the URL; the feature fetches and displays that recipe.
  return (
    <Section>
      <div className="pb-4">
        <Link to="/user" className="inline-flex items-center gap-2 text-sm font-semibold text-towel underline-offset-4 hover:text-ink hover:underline">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 4.5 7 10l5.5 5.5" />
          </svg>
          Back to recipes
        </Link>
      </div>
      <div aria-hidden="true" className="towel-rule text-towel" />

      {id && <RecipeDetails key={id} id={id} />}
    </Section>
  );
}

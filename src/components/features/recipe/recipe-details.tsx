import { useEffect, useState } from "react";

import { getRecipeService, type Recipe } from "@/services/recipe-service";

import RecipeMeta from "@/components/common/recipe-meta";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import UpdateRecipeForm from "@/components/features/recipe/update-recipe-form";

export function RecipeDetails({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadRecipe(recipeId: string) {
      try {
        const result = await getRecipeService(recipeId);
        if (active) {
          setRecipe(result);
        }
      } catch {
        if (active) {
          setError("Recipe not found, or you do not have access to it.");
        }
      }
    }

    loadRecipe(id);

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [id]);

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleUpdated(updatedRecipe: Recipe) {
    setRecipe(updatedRecipe);
    closeForm();
  }

  // Built for cooking: the title and facts on top, then ingredients beside the steps.
  return (
    <>
      {error ? <p role="alert" className="mt-8 border-l-4 border-tomato bg-white p-4">{error}</p> : recipe && <>
        <article className="mt-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <h1 className="text-4xl leading-none font-bold tracking-tight sm:text-6xl">{recipe.name}</h1>
              <div className="mt-8">
                <RecipeMeta cuisine={recipe.cuisine} mealType={recipe.mealType} difficulty={recipe.difficulty} cookTimeMinutes={recipe.cookTimeMinutes} />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">{recipe.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
              <Button className="mt-8" onClick={openForm}>Update recipe</Button>
            </div>
            <img className="aspect-[4/3] w-full rounded-sm bg-glaze object-cover" src={recipe.image} alt={recipe.name} />
          </div>

          <div className="mt-14 grid gap-12 border-t-2 border-ink pt-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
            <section aria-labelledby="ingredients-heading" className="lg:sticky lg:top-6 lg:self-start">
              <h2 id="ingredients-heading" className="text-2xl font-bold tracking-tight">Ingredients</h2>
              {/* Tick ingredients off as you gather them. This is only on screen and is not saved. */}
              <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15 font-serif text-base">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={`${ingredient}-${index}`}>
                    <label className="flex cursor-pointer items-start gap-3 py-3">
                      <input type="checkbox" className="peer mt-1.5 size-4 shrink-0 accent-towel" />
                      <span className="peer-checked:text-ink/55 peer-checked:line-through">{ingredient}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="instructions-heading">
              <h2 id="instructions-heading" className="text-2xl font-bold tracking-tight">Instructions</h2>
              <ol className="mt-4 space-y-8 font-serif">
                {recipe.instructions.map((instruction, index) => (
                  <li key={`${instruction}-${index}`} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
                    <span aria-hidden="true" className="font-sans text-3xl leading-none font-bold text-towel tabular-nums">{index + 1}</span>
                    <p className="max-w-[62ch] text-lg leading-8">{instruction}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </article>

        {/* The modal reuses the recipe form and updates this page after saving. */}
        <Modal open={open} onClose={closeForm} title="Update recipe">
          <UpdateRecipeForm recipe={recipe} onSuccess={handleUpdated} />
        </Modal>
      </>}
    </>
  );
}

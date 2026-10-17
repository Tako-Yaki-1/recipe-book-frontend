import { Table } from "@/components/ui/table";
import { Difficulty } from "@/components/common/difficulty";
import type { AdminRecipe } from "@/services/recipe-service";

export type { AdminRecipe } from "@/services/recipe-service";

type AdminRecipesTableProps = {
  recipes: AdminRecipe[];
  loading: boolean;
};

// Display only: fetching data and handling errors belongs to AdminRecipes.
export function AdminRecipesTable({ recipes, loading }: AdminRecipesTableProps) {
  return (
    <Table>
      <caption className="sr-only">Recipes from all users</caption>
      <thead>
        <tr>
          <th scope="col">Recipe</th>
          <th scope="col">Cuisine</th>
          <th scope="col">Meal type</th>
          <th scope="col">Difficulty</th>
          <th scope="col">Cook time</th>
          <th scope="col">Owner ID</th>
          <th scope="col">Owner name</th>
        </tr>
      </thead>
      <tbody>
        {!loading && recipes.length === 0 && (
          <tr>
            <td colSpan={7} className="py-10!">No recipes have been created yet.</td>
          </tr>
        )}
        {recipes.map(function renderRecipe(recipe) {
          return (
            <tr key={recipe.id}>
              <td>
                <div className="flex min-w-48 items-center gap-3">
                  <img src={recipe.image} alt="" className="size-12 rounded-sm bg-glaze object-cover" />
                  <span className="font-semibold">{recipe.name}</span>
                </div>
              </td>
              <td>{recipe.cuisine}</td>
              <td>{recipe.mealType.join(", ")}</td>
              <td><Difficulty level={recipe.difficulty} /></td>
              <td>{recipe.cookTimeMinutes} min</td>
              <td className="font-mono text-xs">{recipe.userId}</td>
              <td>{recipe.ownerName || "Unnamed user"}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

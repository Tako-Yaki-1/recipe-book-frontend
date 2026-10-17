import { useEffect, useState } from "react";
import { getAllRecipesService } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { AdminRecipesTable, type AdminRecipe } from "./admin-recipes-table";

// This feature owns the recipe request, refresh button, and request state.
export function AdminRecipes() {
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(function fetchRecipes() {
    let active = true;

    async function loadAllRecipes() {
      setLoading(true);
      setError("");

      try {
        const rows = await getAllRecipesService();
        if (active) {
          setRecipes(rows);
        }
      } catch {
        if (active) {
          setError("Unable to load recipes. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAllRecipes();

    // Ignore late responses after leaving the page or starting a new request.
    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [reload]);

  function handleRefresh() {
    // Changing this value runs the fetching effect again.
    setReload(function incrementReload(currentReload) {
      return currentReload + 1;
    });
  }

  return (
    <section aria-label="All recipes">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 pb-4">
        <p className="text-base text-ink/70">{loading ? "Loading recipes…" : `${recipes.length} recipes across all users`}</p>
        <Button variant="secondary" disabled={loading} onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {error ? (
        <p role="alert" className="border-l-4 border-tomato bg-white p-4">{error}</p>
      ) : (
        <AdminRecipesTable recipes={recipes} loading={loading} />
      )}
    </section>
  );
}

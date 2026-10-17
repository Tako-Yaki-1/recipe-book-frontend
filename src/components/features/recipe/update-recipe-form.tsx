import { useState, type SubmitEvent } from "react";
import { updateRecipeService, type Recipe } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

type UpdateRecipeFormProps = {
  recipe: Recipe;
  onSuccess: (updatedRecipe: Recipe) => void;
};

export default function UpdateRecipeForm({ recipe, onSuccess }: UpdateRecipeFormProps) {
  const [name, setName] = useState(recipe.name);
  const [cuisine, setCuisine] = useState(recipe.cuisine);
  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(recipe.cookTimeMinutes);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join("\n"));
  const [instructions, setInstructions] = useState(recipe.instructions.join("\n"));
  const [error, setError] = useState("");

  const handleUpdateRecipe = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const updatedRecipe = await updateRecipeService(recipe.id, {
        name,
        cuisine,
        difficulty,
        cookTimeMinutes: Number(cookTimeMinutes),
        ingredients: ingredients.split("\n").filter((item) => item.trim() !== ""),
        instructions: instructions.split("\n").filter((item) => item.trim() !== ""),
      });

      onSuccess(updatedRecipe);
    } catch (error) {
      setError(typeof error === "object" && error !== null && "response" in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Unable to update recipe.")
        : "Unable to connect to the API.");
    }
  };

  // One column on phones, two on larger screens; separate row and column gaps.
  return (
    <form onSubmit={handleUpdateRecipe} className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div>
        <Label htmlFor="update-recipe-name">Name</Label>
        <Input id="update-recipe-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="update-recipe-cuisine">Cuisine</Label>
        <Input id="update-recipe-cuisine" type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="update-recipe-difficulty">Difficulty</Label>
        <Select id="update-recipe-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Recipe["difficulty"])}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="update-recipe-cook-time">Cook time (minutes)</Label>
        <Input id="update-recipe-cook-time" type="number" min="0" value={cookTimeMinutes} onChange={(e) => setCookTimeMinutes(Number(e.target.value))} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="update-recipe-ingredients">Ingredients (one per line)</Label>
        <Textarea id="update-recipe-ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={5} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="update-recipe-instructions">Instructions (one per line)</Label>
        <Textarea id="update-recipe-instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={5} />
      </div>

      {error && <p role="alert" className="text-sm text-tomato sm:col-span-2">{error}</p>}
      <Button type="submit" className="w-full sm:col-span-2">
        Save changes
      </Button>
    </form>
  );
}

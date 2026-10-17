import { useState, type SubmitEvent } from "react";
import { createRecipeService, type Recipe } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

type AddRecipeFormProps = {
  onSuccess: (newRecipe: Recipe) => void;
};

type FormErrors = {
  name?: string;
  image?: string;
  cuisine?: string;
  difficulty?: string;
  cookTimeMinutes?: string;
  mealType?: string;
  tags?: string;
  ingredients?: string;
  instructions?: string;
};

const messages: FormErrors = {
  name: "Name is required",
  image: "Image URL is required",
  cuisine: "Cuisine is required",
  difficulty: "Difficulty is required",
  cookTimeMinutes: "Cook time is required",
  mealType: "Meal type is required",
  tags: "Tags are required",
  ingredients: "Ingredients are required",
  instructions: "Instructions are required",
};

export default function AddRecipeForm({ onSuccess }: AddRecipeFormProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [cookTimeMinutes, setCookTimeMinutes] = useState("");
  const [mealType, setMealType] = useState("");
  const [tags, setTags] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");

  // show error if empty, remove error if has value
  const checkField = (field: keyof FormErrors, value: string) => {
    setErrors({
      ...errors,
      [field]: value.trim() === "" ? messages[field] : undefined,
    });
  };

  const handleAddRecipe = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const values = { name, image, cuisine, difficulty, cookTimeMinutes, mealType, tags, ingredients, instructions };

    const newErrors: FormErrors = {};
    let hasError = false;

    // check each required field
    for (const field in values) {
      const key = field as keyof FormErrors;

      if (values[key].trim() === "") {
        newErrors[key] = messages[key];
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError === true) {
      return;
    }

    try {
      const newRecipe = await createRecipeService({
        name,
        image,
        cuisine,
        difficulty,
        cookTimeMinutes: Number(cookTimeMinutes),
        mealType: mealType.split("\n").filter((item) => item.trim() !== ""),
        tags: tags.split("\n").filter((item) => item.trim() !== ""),
        ingredients: ingredients.split("\n").filter((item) => item.trim() !== ""),
        instructions: instructions.split("\n").filter((item) => item.trim() !== ""),
      });

      onSuccess(newRecipe);
    } catch (error) {
      setSubmitError(typeof error === "object" && error !== null && "response" in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Unable to create recipe.")
        : "Unable to connect to the API.");
    }
  };

  // One column on phones, two on larger screens; separate row and column gaps.
  return (
    <form onSubmit={handleAddRecipe} className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div>
        <Label htmlFor="recipe-name" error={errors.name}>Name</Label>
        <Input id="recipe-name" type="text" value={name} onChange={(e) => { setName(e.target.value); checkField("name", e.target.value); }} onBlur={() => checkField("name", name)} error={errors.name} />
      </div>

      <div>
        <Label htmlFor="recipe-image" error={errors.image}>Image URL</Label>
        <Input id="recipe-image" type="url" value={image} onChange={(e) => { setImage(e.target.value); checkField("image", e.target.value); }} onBlur={() => checkField("image", image)} placeholder="https://example.com/image.jpg" error={errors.image} />
      </div>

      <div>
        <Label htmlFor="recipe-cuisine" error={errors.cuisine}>Cuisine</Label>
        <Input id="recipe-cuisine" type="text" value={cuisine} onChange={(e) => { setCuisine(e.target.value); checkField("cuisine", e.target.value); }} onBlur={() => checkField("cuisine", cuisine)} error={errors.cuisine} />
      </div>

      <div>
        <Label htmlFor="recipe-difficulty" error={errors.difficulty}>Difficulty</Label>
        <Select id="recipe-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="recipe-cook-time" error={errors.cookTimeMinutes}>Cook time (minutes)</Label>
        <Input id="recipe-cook-time" type="number" min="0" value={cookTimeMinutes} onChange={(e) => { setCookTimeMinutes(e.target.value); checkField("cookTimeMinutes", e.target.value); }} onBlur={() => checkField("cookTimeMinutes", cookTimeMinutes)} error={errors.cookTimeMinutes} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-meal-type" error={errors.mealType}>Meal type (one per line)</Label>
        <Textarea
          id="recipe-meal-type" value={mealType} onChange={(e) => { setMealType(e.target.value); checkField("mealType", e.target.value); }} onBlur={() => checkField("mealType", mealType)} rows={3} placeholder={"Breakfast\nLunch\nDinner"} error={errors.mealType} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-tags" error={errors.tags}>Tags (one per line)</Label>
        <Textarea
          id="recipe-tags" value={tags} onChange={(e) => { setTags(e.target.value); checkField("tags", e.target.value); }} onBlur={() => checkField("tags", tags)} rows={3} placeholder={"Italian\nPizza"} error={errors.tags} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-ingredients" error={errors.ingredients}>Ingredients (one per line)</Label>
        <Textarea
          id="recipe-ingredients" value={ingredients} onChange={(e) => { setIngredients(e.target.value); checkField("ingredients", e.target.value); }} onBlur={() => checkField("ingredients", ingredients)} rows={3} error={errors.ingredients} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-instructions" error={errors.instructions}>Instructions (one per line)</Label>
        <Textarea
          id="recipe-instructions" value={instructions} onChange={(e) => { setInstructions(e.target.value); checkField("instructions", e.target.value); }} onBlur={() => checkField("instructions", instructions)} rows={3} error={errors.instructions} />
      </div>

      {submitError && <p role="alert" className="text-sm text-tomato sm:col-span-2">{submitError}</p>}
      <Button type="submit" className="w-full sm:col-span-2">
        Add recipe
      </Button>
    </form>
  );
}

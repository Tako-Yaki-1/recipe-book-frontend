import { useEffect, useRef, useState } from "react";
import { Difficulty } from "@/components/common/difficulty";
import { cn } from "@/lib/cn";

const ingredients = ["Day-old rice", "Garlic, minced", "Eggs", "Soy sauce", "Spring onions"];

// People who prefer reduced motion see the first three already crossed off.
function getInitialChecks() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return ingredients.map((_, index) => reduceMotion && index < 3);
}

// A small demo of the recipe page. It is decoration, so it is hidden from screen readers
// and skipped by the Tab key. Mouse users can still click ingredients to cross them off.
export function AuthSampleRecipe() {
  const [checks, setChecks] = useState(getInitialChecks);
  const touched = useRef(false);

  // After the page settles, cross off the first three ingredients one at a time.
  useEffect(function crossOffIngredients() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers = [0, 1, 2].map(function scheduleCheck(index) {
      return window.setTimeout(function check() {
        // Stop if the visitor has already started clicking.
        if (touched.current) return;
        setChecks((current) => current.map((value, position) => (position === index ? true : value)));
      }, 1700 + index * 650);
    });

    function cleanup() {
      timers.forEach((timer) => window.clearTimeout(timer));
    }

    return cleanup;
  }, []);

  function toggle(index: number) {
    touched.current = true;
    setChecks((current) => current.map((value, position) => (position === index ? !value : value)));
  }

  // Shown only when the screen is wide and tall enough to fit it next to the wordmark.
  return (
    <div
      aria-hidden="true"
      className="mt-12 hidden max-w-sm animate-rise motion-reduce:animate-none [@media(min-width:1024px)_and_(min-height:820px)]:block"
      style={{ animationDelay: "800ms" }}
    >
      <div className="rounded-sm bg-plate text-ink">
        <div className="towel-rule rounded-t-sm text-towel" />
        <div className="p-5">
          <p className="text-2xl font-bold tracking-tight">Garlic fried rice</p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="font-semibold">15 min</span>
            <Difficulty level="Easy" />
          </div>

          <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15 font-serif text-base">
            {ingredients.map((name, index) => (
              <li key={name}>
                <label className="flex cursor-pointer items-center gap-3 py-2.5">
                  <input type="checkbox" tabIndex={-1} checked={checks[index]} onChange={() => toggle(index)} className="size-4 shrink-0 accent-towel" />
                  <span className={cn("relative inline-block transition-colors duration-300 motion-reduce:transition-none", checks[index] && "text-ink/55")}>
                    {name}
                    {/* The line that crosses the ingredient out grows from the left. */}
                    <span className={cn("absolute top-1/2 left-0 h-0.5 w-full origin-left bg-ink/55 transition-transform duration-300 ease-out motion-reduce:transition-none", checks[index] ? "scale-x-100" : "scale-x-0")} />
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-sm text-plate/80">Cross off ingredients as you gather them.</p>
    </div>
  );
}

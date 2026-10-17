import { AuthSampleRecipe } from "@/components/features/auth/auth-sample-recipe";
import { cn } from "@/lib/cn";

// Four bands like a real dish towel: two wide, two thin (one of them red). They draw in from the left.
const bands = [
  { color: "bg-plate", size: "h-3 lg:h-5", delay: 0 },
  { color: "bg-plate", size: "h-1 lg:h-1.5", delay: 110 },
  { color: "bg-tomato", size: "h-1 lg:h-1.5", delay: 220 },
  { color: "bg-plate", size: "h-3 lg:h-5", delay: 330 },
];

// Shared branding for the login and signup pages.
// On load the stripes sweep across, the name rises into place, then the sample recipe appears.
export function AuthHeader() {
  return (
    <header className="woven flex flex-col justify-between bg-towel px-6 pt-10 text-plate sm:px-12 lg:pt-16">
      <div className="pb-10 lg:pb-0">
        <h1 aria-label="Recipe Book" className="text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
          {/* Each word sits in a clipped box and rises up from its bottom edge. */}
          <span aria-hidden="true" className="block -my-[0.15em] overflow-hidden py-[0.15em]">
            <span className="block animate-reveal motion-reduce:animate-none" style={{ animationDelay: "250ms" }}>Recipe</span>
          </span>
          <span aria-hidden="true" className="block -my-[0.15em] overflow-hidden py-[0.15em]">
            <span className="block animate-reveal motion-reduce:animate-none" style={{ animationDelay: "370ms" }}>Book</span>
          </span>
        </h1>
        <p className="mt-5 max-w-xs animate-fade text-lg text-plate/85 motion-reduce:animate-none" style={{ animationDelay: "700ms" }}>
          Keep your favorite meals in one place.
        </p>

        <AuthSampleRecipe />
      </div>

      <div aria-hidden="true" className="-mx-6 mb-10 flex flex-col gap-2 sm:-mx-12 lg:mb-16 lg:gap-2.5">
        {bands.map((band) => (
          <div
            key={band.delay}
            className={cn("origin-left animate-sweep motion-reduce:animate-none", band.color, band.size)}
            style={{ animationDelay: `${band.delay}ms` }}
          />
        ))}
      </div>
    </header>
  );
}

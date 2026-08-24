import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

export function SearchBar({
  initialValue = "",
  size = "md",
  autoFocus = false,
  className,
}: {
  initialValue?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    void navigate({ to: "/search", search: { q, page: 1 } });
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn(
        "group glass relative flex items-center rounded-full transition-all duration-400 ease-[var(--ease-out-soft)] focus-within:border-primary/60 focus-within:shadow-glow",
        className,
      )}
    >
      <label htmlFor={`anivault-search-${size}`} className="sr-only">
        Search anime
      </label>
      <Search
        className="pointer-events-none absolute left-4 size-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-accent"
        aria-hidden="true"
      />
      <input
        id={`anivault-search-${size}`}
        type="search"
        name="q"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search anime, e.g. Attack on Titan"
        className={cn(
          "w-full bg-transparent pl-11 pr-28 text-foreground placeholder:text-muted-foreground/70 focus:outline-none",
          size === "lg" ? "h-14 text-base" : size === "md" ? "h-12 text-sm" : "h-10 text-sm",
        )}
      />
      <button
        type="submit"
        className={cn(
          "absolute right-1.5 rounded-full bg-gradient-primary font-semibold text-primary-foreground transition-all duration-300 hover:shadow-glow hover:brightness-110 active:scale-95",
          size === "lg" ? "h-11 px-6 text-sm" : size === "md" ? "h-9 px-5 text-sm" : "h-7 px-4 text-xs",
        )}
      >
        Search
      </button>
    </form>
  );
}

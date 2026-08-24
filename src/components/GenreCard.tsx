import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { slugify, type Genre } from "@/lib/jikan";

export function GenreCard({ genre }: { genre: Genre }) {
  return (
    <Link
      to="/genre/$slug"
      params={{ slug: slugify(genre.name) }}
      className="group glass relative flex items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-4 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
    >
      <span
        className="absolute inset-0 -translate-x-full bg-gradient-primary opacity-15 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-0"
        aria-hidden="true"
      />
      <span className="relative">
        <span className="block font-display text-base font-semibold transition-colors duration-300 group-hover:text-accent">
          {genre.name}
        </span>
        {typeof genre.count === "number" ? (
          <span className="block text-xs text-muted-foreground">
            {genre.count.toLocaleString()} titles
          </span>
        ) : null}
      </span>
      <ArrowUpRight
        className="relative size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        aria-hidden="true"
      />
    </Link>
  );
}

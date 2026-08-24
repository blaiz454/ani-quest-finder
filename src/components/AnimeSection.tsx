import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { AnimeCard } from "./AnimeCard";
import { AnimeCardSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import type { Anime } from "@/lib/jikan";

/** Horizontally scrollable row of anime — used for the home page sections. */
export function AnimeSection({
  id,
  title,
  description,
  icon,
  items,
  loading,
  error,
  onRetry,
  href,
}: {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  items: Anime[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  href?: { to: string; search?: Record<string, unknown> };
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id={`${id}-heading`}
            className="flex items-center gap-2 text-2xl font-bold sm:text-3xl"
          >
            {icon ? <span className="text-accent">{icon}</span> : null}
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            to={href.to}
            search={href.search as never}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-accent"
          >
            View all
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>

      {error ? (
        <ErrorState
          title={`Couldn't load ${title.toLowerCase()}`}
          message="The MyAnimeList service didn't respond. You can retry this section."
          {...(onRetry ? { onRetry } : {})}
        />
      ) : (
        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {loading && items.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[42vw] shrink-0 sm:w-44 lg:w-48">
                  <AnimeCardSkeleton />
                </div>
              ))
            : items.map((anime, i) => (
                <div
                  key={`${anime.mal_id}-${i}`}
                  className="w-[42vw] shrink-0 snap-start sm:w-44 lg:w-48"
                >
                  <AnimeCard anime={anime} />
                </div>
              ))}
        </div>
      )}
    </section>
  );
}

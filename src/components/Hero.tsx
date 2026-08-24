import { Link } from "@tanstack/react-router";
import { Flame, Info } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { RatingBadge } from "./RatingBadge";
import { Skeleton } from "./LoadingSkeleton";
import { displayTitle, truncate, type Anime } from "@/lib/jikan";

export function Hero({ featured, loading }: { featured?: Anime | undefined; loading?: boolean }) {
  const backdrop =
    featured?.trailer?.images?.maximum_image_url ??
    featured?.images?.jpg?.large_image_url ??
    featured?.images?.webp?.large_image_url;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <div className="absolute inset-0 -z-10">
        {backdrop ? (
          <img
            src={backdrop}
            alt={featured ? `Backdrop artwork for ${displayTitle(featured)}` : ""}
            className="size-full scale-105 object-cover opacity-40 blur-[2px]"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <div className="size-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-veil" />
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8">
        <div className="animate-rise">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-accent">
            <Flame className="size-3.5" aria-hidden="true" />
            Live data from MyAnimeList
          </span>

          <h1
            id="hero-heading"
            className="mt-5 max-w-2xl text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl"
          >
            Discover Your Next <span className="text-gradient">Anime Obsession</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Browse trending, popular and top-rated anime. Dive into scores, episodes, studios,
            genres and trailers — all in one fast, beautifully dark vault.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar size="lg" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110"
            >
              Browse the vault
            </Link>
            <Link
              to="/genres"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-accent"
            >
              Explore genres
            </Link>
          </div>
        </div>

        <div className="animate-rise justify-self-center [animation-delay:120ms]">
          {loading || !featured ? (
            <Skeleton className="aspect-[2/3] w-56 rounded-2xl sm:w-64" />
          ) : (
            <Link
              to="/anime/$id"
              params={{ id: String(featured.mal_id) }}
              className="group relative block w-56 sm:w-64 lg:w-72"
            >
              <div className="animate-float overflow-hidden rounded-2xl border border-border shadow-glow transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]">
                <img
                  src={
                    featured.images?.webp?.large_image_url ??
                    featured.images?.jpg?.large_image_url ??
                    ""
                  }
                  alt={`${displayTitle(featured)} poster — featured anime on AniVault`}
                  width={320}
                  height={480}
                  fetchPriority="high"
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
              <div className="glass mt-4 rounded-xl p-4">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  <Info className="size-3.5" aria-hidden="true" /> Featured now
                </p>
                <h2 className="mt-1 line-clamp-2 font-display text-base font-semibold transition-colors duration-300 group-hover:text-accent">
                  {displayTitle(featured)}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <RatingBadge score={featured.score ?? null} />
                  <span className="text-xs text-muted-foreground">
                    {featured.episodes ? `${featured.episodes} eps` : featured.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {truncate(featured.synopsis, 140)}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

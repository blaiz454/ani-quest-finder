import { createFileRoute } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Award, Clock3, Flame, Sparkles, TrendingUp } from "lucide-react";
import { Hero } from "@/components/Hero";
import { AnimeSection } from "@/components/AnimeSection";
import { GenreCard } from "@/components/GenreCard";
import { Skeleton } from "@/components/LoadingSkeleton";
import {
  genresQuery,
  seasonNowQuery,
  topAnimeQuery,
} from "@/lib/anime-queries";

const TITLE = "AniVault — Discover Trending, Popular & Top-Rated Anime";
const DESCRIPTION =
  "AniVault is a fast anime discovery platform. Browse trending, popular and top-rated anime, explore genres, and open detailed pages with scores, episodes, studios and trailers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AniVault",
          description: DESCRIPTION,
          potentialAction: {
            "@type": "SearchAction",
            target: "/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const trending = useQuery(topAnimeQuery("airing", 14));
  const [popular, topRated, season] = useQueries({
    queries: [topAnimeQuery("bypopularity", 14), topAnimeQuery(undefined, 14), seasonNowQuery(14)],
  });
  const genres = useQuery(genresQuery());

  const featured = trending.data?.data?.[0];
  const topGenres = (genres.data ?? [])
    .slice()
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 12);

  return (
    <>
      <Hero featured={featured} loading={trending.isPending} />

      <AnimeSection
        id="trending"
        title="Trending Now"
        description="Currently airing series the community is watching this week."
        icon={<TrendingUp className="size-6" />}
        items={trending.data?.data ?? []}
        loading={trending.isPending}
        error={trending.isError}
        onRetry={() => void trending.refetch()}
        href={{ to: "/search", search: { q: "", page: 1 } }}
      />

      <AnimeSection
        id="popular"
        title="Most Popular"
        description="The most-watched titles of all time on MyAnimeList."
        icon={<Flame className="size-6" />}
        items={popular.data?.data ?? []}
        loading={popular.isPending}
        error={popular.isError}
        onRetry={() => void popular.refetch()}
      />

      <AnimeSection
        id="top-rated"
        title="Top Rated"
        description="Highest community scores across every season."
        icon={<Award className="size-6" />}
        items={topRated.data?.data ?? []}
        loading={topRated.isPending}
        error={topRated.isError}
        onRetry={() => void topRated.refetch()}
      />

      <AnimeSection
        id="this-season"
        title="This Season"
        description="Fresh releases airing in the current anime season."
        icon={<Clock3 className="size-6" />}
        items={season.data?.data ?? []}
        loading={season.isPending}
        error={season.isError}
        onRetry={() => void season.refetch()}
      />

      <section
        aria-labelledby="genres-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-5">
          <h2 id="genres-heading" className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Sparkles className="size-6 text-accent" aria-hidden="true" />
            Browse by Genre
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Jump straight into the mood you're after.
          </p>
        </div>

        {genres.isPending ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-[74px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topGenres.map((g) => (
              <GenreCard key={g.mal_id} genre={g} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

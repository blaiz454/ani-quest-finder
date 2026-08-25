import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Tags } from "lucide-react";
import { GenreCard } from "@/components/GenreCard";
import { Skeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { genresQuery } from "@/lib/anime-queries";

const TITLE = "Anime Genres — Action, Romance, Fantasy & More | AniVault";
const DESCRIPTION =
  "Explore every anime genre on AniVault. Browse action, romance, fantasy, comedy, sci-fi, horror and dozens more, each with its own curated list of top-rated titles.";

export const Route = createFileRoute("/genres")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/genres" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/genres" }],
  }),
  component: GenresPage,
});

function GenresPage() {
  const genres = useQuery(genresQuery());
  const sorted = (genres.data ?? []).slice().sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
          <Tags className="size-4" aria-hidden="true" />
          Genres
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Browse anime by <span className="text-gradient">genre</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every genre in the MyAnimeList taxonomy, ordered by how many titles it contains. Pick a
          mood and dive in.
        </p>
      </header>

      <main>
        {genres.isError ? (
          <ErrorState onRetry={() => void genres.refetch()} />
        ) : genres.isPending ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="h-[74px] rounded-xl" />
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.map((g) => (
              <li key={g.mal_id}>
                <GenreCard genre={g} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

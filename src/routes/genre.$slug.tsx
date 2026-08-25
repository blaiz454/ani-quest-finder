import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { AnimeGrid } from "@/components/AnimeGrid";
import { ErrorState } from "@/components/ErrorState";
import { AnimeCardSkeleton } from "@/components/LoadingSkeleton";
import { genresQuery } from "@/lib/anime-queries";
import { searchAnime, slugify, type Anime } from "@/lib/jikan";

function label(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const Route = createFileRoute("/genre/$slug")({
  head: ({ params }) => {
    const name = label(params.slug);
    const title = `${name} Anime — Top ${name} Series & Movies | AniVault`;
    const description = `Discover the best ${name.toLowerCase()} anime on AniVault. Browse top-rated ${name.toLowerCase()} series and movies with scores, episode counts, studios and full details.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/genre/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/genre/${params.slug}` }],
    };
  },
  component: GenrePage,
});

function GenrePage() {
  const { slug } = Route.useParams();
  const genres = useQuery(genresQuery());
  const genre = (genres.data ?? []).find((g) => slugify(g.name) === slug);
  const name = genre?.name ?? label(slug);

  const query = useInfiniteQuery({
    queryKey: ["jikan", "genre", genre?.mal_id],
    initialPageParam: 1,
    enabled: Boolean(genre),
    queryFn: ({ pageParam }) =>
      searchAnime({
        q: "",
        genres: String(genre!.mal_id),
        page: pageParam,
        limit: 24,
        orderBy: "score",
        sort: "desc",
      }),
    getNextPageParam: (last, all) => (last.pagination?.has_next_page ? all.length + 1 : undefined),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const items: Anime[] = query.data?.pages.flatMap((p) => p.data) ?? [];
  const notFound = !genres.isPending && !genres.isError && !genre;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-accent">
              Home
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link to="/genres" className="transition-colors hover:text-accent">
              Genres
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li aria-current="page" className="text-foreground">
            {name}
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Best <span className="text-gradient">{name}</span> anime
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Top-rated {name.toLowerCase()} series and movies, ranked by community score.
        </p>
      </header>

      <main>
        {genres.isError || query.isError ? (
          <ErrorState onRetry={() => void (genres.isError ? genres.refetch() : query.refetch())} />
        ) : notFound ? (
          <ErrorState
            title="Genre not found"
            message="We don't recognise that genre. Head back to the genre list to pick another."
          />
        ) : (
          <>
            <AnimeGrid
              items={items}
              loading={genres.isPending || query.isPending || query.isLoading}
              skeletonCount={18}
            />

            {query.isFetchingNextPage ? (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : null}

            {query.hasNextPage ? (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => void query.fetchNextPage()}
                  disabled={query.isFetchingNextPage}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
                >
                  {query.isFetchingNextPage ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  Load more
                </button>
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}

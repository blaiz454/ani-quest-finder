import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { AnimeGrid } from "@/components/AnimeGrid";
import { ErrorState } from "@/components/ErrorState";
import { AnimeCardSkeleton } from "@/components/LoadingSkeleton";
import { searchAnime, type Anime } from "@/lib/jikan";

type SearchParams = { q: string; page: number };

const TITLE = "Search Anime — Browse the Full Catalogue | AniVault";
const DESCRIPTION =
  "Search thousands of anime by title on AniVault. See scores, release years, episode counts, genres and synopses, then open a full detail page for any series.";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search["q"] === "string" ? search["q"].slice(0, 120) : "",
    page: Math.max(1, Number(search["page"]) || 1),
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/search" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();

  const query = useInfiniteQuery({
    queryKey: ["jikan", "search-infinite", q],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      searchAnime({
        q,
        page: pageParam,
        limit: 24,
        ...(q ? {} : { orderBy: "score", sort: "desc" as const }),
      }),
    getNextPageParam: (last, all) => (last.pagination?.has_next_page ? all.length + 1 : undefined),
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  const items: Anime[] = query.data?.pages.flatMap((p) => p.data) ?? [];
  const total = query.data?.pages[0]?.pagination?.items?.total;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
          <SearchIcon className="size-4" aria-hidden="true" />
          Browse
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          {q ? (
            <>
              Results for <span className="text-gradient">“{q}”</span>
            </>
          ) : (
            <>
              Browse the <span className="text-gradient">AniVault</span> catalogue
            </>
          )}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {typeof total === "number"
            ? `${total.toLocaleString()} titles found`
            : "Search by title, or scroll the highest-rated anime of all time."}
        </p>
        <div className="mt-6 max-w-2xl">
          <SearchBar initialValue={q} size="md" />
        </div>
      </header>

      <main>
        {query.isError ? (
          <ErrorState
            message={(query.error as Error)?.message}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <>
            <AnimeGrid
              items={items}
              loading={query.isPending}
              skeletonCount={18}
              emptyMessage={`No anime matched “${q}”. Try a shorter or differently spelled title.`}
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
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110 disabled:opacity-60"
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

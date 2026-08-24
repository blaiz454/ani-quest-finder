import { AnimeCard } from "./AnimeCard";
import { AnimeGridSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./ErrorState";
import type { Anime } from "@/lib/jikan";

export function AnimeGrid({
  items,
  loading = false,
  skeletonCount = 12,
  emptyMessage,
}: {
  items: Anime[];
  loading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
}) {
  if (loading && items.length === 0) return <AnimeGridSkeleton count={skeletonCount} />;
  if (!loading && items.length === 0)
    return <EmptyState message={emptyMessage ?? "Try a different search term or genre."} />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((anime, i) => (
        <AnimeCard key={`${anime.mal_id}-${i}`} anime={anime} priority={i < 6} />
      ))}
    </div>
  );
}

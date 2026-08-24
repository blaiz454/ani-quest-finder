import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg bg-muted/60", className)} />;
}

export function AnimeCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <Skeleton className="h-[38vh] w-full rounded-2xl" />
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

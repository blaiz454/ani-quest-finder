import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import { RatingBadge } from "./RatingBadge";
import { displayTitle, posterUrl, FALLBACK_POSTER, type Anime } from "@/lib/jikan";
import { cn } from "@/lib/utils";

export function AnimeCard({
  anime,
  priority = false,
  className,
}: {
  anime: Anime;
  priority?: boolean;
  className?: string;
}) {
  const [src, setSrc] = useState(() => posterUrl(anime, "medium"));
  const title = displayTitle(anime);
  const genres = (anime.genres ?? []).slice(0, 2);

  return (
    <article className={cn("group relative", className)}>
      <Link
        to="/anime/$id"
        params={{ id: String(anime.mal_id) }}
        className="block rounded-xl outline-none transition-transform duration-500 ease-[var(--ease-out-soft)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-hover:-translate-y-2"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          <img
            src={src}
            onError={() => setSrc(FALLBACK_POSTER)}
            alt={`${title} anime poster`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            width={225}
            height={320}
            className="size-full object-cover transition-all duration-700 ease-[var(--ease-out-soft)] group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-veil opacity-70 transition-opacity duration-500 group-hover:opacity-95" />

          <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-primary/0 transition-all duration-500 group-hover:ring-2 group-hover:ring-primary/60 group-hover:shadow-glow" />

          <div className="absolute left-2 top-2">
            <RatingBadge score={anime.score ?? null} />
          </div>

          {anime.type ? (
            <span className="absolute right-2 top-2 rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
              {anime.type}
            </span>
          ) : null}

          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
            <span className="flex size-12 translate-y-3 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform duration-500 group-hover:translate-y-0">
              <Play className="size-5 translate-x-px fill-current" aria-hidden="true" />
            </span>
          </span>

          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent">
              {title}
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted-foreground">
              <span>{anime.year ?? anime.aired?.from?.slice(0, 4) ?? "TBA"}</span>
              {genres.length > 0 && <span aria-hidden="true">•</span>}
              <span className="line-clamp-1">{genres.map((g) => g.name).join(", ")}</span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

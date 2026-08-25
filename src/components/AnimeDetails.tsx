import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Film,
  Flame,
  Hash,
  PlayCircle,
  Users,
} from "lucide-react";
import { RatingBadge } from "./RatingBadge";
import {
  displayTitle,
  slugify,
  FALLBACK_POSTER,
  type Anime,
  type JikanEntity,
} from "@/lib/jikan";

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-3">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="text-accent">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function EntityList({ items, label }: { items?: JikanEntity[] | undefined; label: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <p className="mt-1.5 text-sm text-foreground">{items.map((i) => i.name).join(", ")}</p>
    </div>
  );
}

export function AnimeDetails({ anime }: { anime: Anime }) {
  const title = displayTitle(anime);
  const [poster, setPoster] = useState(
    anime.images?.webp?.large_image_url ?? anime.images?.jpg?.large_image_url ?? FALLBACK_POSTER,
  );
  const backdrop =
    anime.trailer?.images?.maximum_image_url ?? anime.images?.jpg?.large_image_url ?? undefined;
  const synopsis = (anime.synopsis ?? "").replace(/\s*\[Written by MAL Rewrite\]\s*$/i, "").trim();

  return (
    <article>
      {/* Backdrop hero */}
      <div className="relative isolate -mt-16 h-[46vh] min-h-72 w-full overflow-hidden">
        {backdrop ? (
          <img
            src={backdrop}
            alt={`Key visual artwork from ${title}`}
            className="size-full scale-105 object-cover opacity-45 blur-[3px]"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <div className="size-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-veil" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="-mt-6 mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <li>
              <Link to="/" className="transition-colors hover:text-accent">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li>
              <Link to="/search" className="transition-colors hover:text-accent">
                Browse
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li aria-current="page" className="line-clamp-1 text-foreground">
              {title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 md:grid-cols-[minmax(180px,240px)_1fr]">
          <div className="mx-auto w-40 sm:w-52 md:mx-0 md:w-full">
            <img
              src={poster}
              onError={() => setPoster(FALLBACK_POSTER)}
              alt={`${title} anime poster`}
              width={320}
              height={480}
              className="aspect-[2/3] w-full rounded-2xl border border-border object-cover shadow-glow"
            />
            {anime.trailer?.url ? (
              <a
                href={anime.trailer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110"
              >
                <PlayCircle className="size-4" aria-hidden="true" />
                Watch trailer
              </a>
            ) : null}
          </div>

          <div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {anime.title !== title ? <span>{anime.title}</span> : null}
              {anime.title_japanese ? (
                <span className="block sm:inline sm:before:mx-2 sm:before:content-['•']">
                  {anime.title_japanese}
                </span>
              ) : null}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <RatingBadge score={anime.score ?? null} size="lg" />
              {anime.rank ? (
                <span className="glass rounded-full px-3 py-1 text-xs font-semibold">
                  Rank #{anime.rank}
                </span>
              ) : null}
              {anime.popularity ? (
                <span className="glass rounded-full px-3 py-1 text-xs font-semibold">
                  Popularity #{anime.popularity}
                </span>
              ) : null}
              {anime.rating ? (
                <span className="glass rounded-full px-3 py-1 text-xs text-muted-foreground">
                  {anime.rating}
                </span>
              ) : null}
            </div>

            {(anime.genres ?? []).length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {anime.genres!.map((g) => (
                  <li key={g.mal_id}>
                    <Link
                      to="/genre/$slug"
                      params={{ slug: slugify(g.name) }}
                      className="inline-block rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-accent"
                    >
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <section aria-labelledby="synopsis-heading" className="mt-7">
              <h2 id="synopsis-heading" className="text-xl font-bold">
                Synopsis
              </h2>
              <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {synopsis || "No synopsis is available for this title yet."}
              </p>
            </section>

            <section aria-labelledby="info-heading" className="mt-8">
              <h2 id="info-heading" className="sr-only">
                Anime information
              </h2>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <Meta icon={<Film className="size-3.5" />} label="Episodes" value={anime.episodes ?? "?"} />
                <Meta icon={<Flame className="size-3.5" />} label="Status" value={anime.status ?? "Unknown"} />
                <Meta
                  icon={<CalendarDays className="size-3.5" />}
                  label="Aired"
                  value={anime.aired?.string ?? "Unknown"}
                />
                <Meta
                  icon={<Hash className="size-3.5" />}
                  label="Season"
                  value={
                    anime.season
                      ? `${anime.season[0]!.toUpperCase()}${anime.season.slice(1)} ${anime.year ?? ""}`.trim()
                      : (anime.year ?? "TBA")
                  }
                />
                <Meta icon={<Clock className="size-3.5" />} label="Duration" value={anime.duration ?? "—"} />
                <Meta icon={<Film className="size-3.5" />} label="Type" value={anime.type ?? "—"} />
                <Meta
                  icon={<Users className="size-3.5" />}
                  label="Members"
                  value={anime.members ? anime.members.toLocaleString() : "—"}
                />
                <Meta icon={<Hash className="size-3.5" />} label="Source" value={anime.source ?? "—"} />
              </dl>
            </section>

            <section aria-labelledby="credits-heading" className="mt-8 grid gap-5 sm:grid-cols-2">
              <h2 id="credits-heading" className="sr-only">
                Production credits
              </h2>
              <EntityList items={anime.studios} label="Studios" />
              <EntityList items={anime.producers} label="Producers" />
              <EntityList items={anime.themes} label="Themes" />
              <EntityList items={anime.demographics} label="Demographics" />
            </section>

            {anime.trailer?.embed_url ? (
              <section aria-labelledby="trailer-heading" className="mt-10">
                <h2 id="trailer-heading" className="text-xl font-bold">
                  Trailer
                </h2>
                <div className="mt-3 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-card">
                  <iframe
                    src={anime.trailer.embed_url.replace("autoplay=1", "autoplay=0")}
                    title={`${title} official trailer`}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Jikan API service layer (https://docs.api.jikan.moe/)
 * All network access to MyAnimeList data goes through this module.
 * UI components never call fetch directly.
 */

const BASE_URL = (
  import.meta.env["VITE_JIKAN_BASE_URL"] ?? "https://api.jikan.moe/v4"
).replace(/\/$/, "");

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface JikanImageSet {
  image_url?: string | null;
  small_image_url?: string | null;
  large_image_url?: string | null;
  maximum_image_url?: string | null;
}

export interface JikanEntity {
  mal_id: number;
  type?: string;
  name: string;
  url?: string;
}

export interface JikanTrailer {
  youtube_id?: string | null;
  url?: string | null;
  embed_url?: string | null;
  images?: JikanImageSet | null;
}

export interface Anime {
  mal_id: number;
  url?: string;
  images?: {
    jpg?: JikanImageSet;
    webp?: JikanImageSet;
  };
  trailer?: JikanTrailer | null;
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  synopsis?: string | null;
  background?: string | null;
  type?: string | null;
  source?: string | null;
  episodes?: number | null;
  status?: string | null;
  airing?: boolean;
  aired?: { from?: string | null; to?: string | null; string?: string | null };
  duration?: string | null;
  rating?: string | null;
  score?: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  favorites?: number | null;
  season?: string | null;
  year?: number | null;
  genres?: JikanEntity[];
  explicit_genres?: JikanEntity[];
  themes?: JikanEntity[];
  demographics?: JikanEntity[];
  studios?: JikanEntity[];
  producers?: JikanEntity[];
  licensors?: JikanEntity[];
}

export interface Genre {
  mal_id: number;
  name: string;
  url?: string;
  count?: number;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page?: number;
  items?: { count: number; total: number; per_page: number };
}

export interface Paged<T> {
  data: T[];
  pagination: Pagination;
}

/* -------------------------------------------------------------------------- */
/* Request queue — Jikan allows ~3 req/s. Serialize + backoff on 429.          */
/* -------------------------------------------------------------------------- */

const MIN_GAP_MS = 380;
let chain: Promise<unknown> = Promise.resolve();
let lastCall = 0;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function throttled<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const gap = Date.now() - lastCall;
    if (gap < MIN_GAP_MS) await wait(MIN_GAP_MS - gap);
    try {
      return await task();
    } finally {
      lastCall = Date.now();
    }
  });
  chain = run.catch(() => undefined);
  return run as Promise<T>;
}

export class JikanError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "JikanError";
    this.status = status;
  }
}

async function request<T>(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(BASE_URL + path);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }

  return throttled(async () => {
    let attempt = 0;
    // Retry a couple of times on rate limiting / transient upstream errors.
    for (;;) {
      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });

      if (res.ok) return (await res.json()) as T;

      if ((res.status === 429 || res.status >= 500) && attempt < 2) {
        attempt += 1;
        await wait(700 * attempt);
        continue;
      }

      throw new JikanError(
        res.status === 404
          ? "We couldn't find that anime."
          : res.status === 429
            ? "MyAnimeList is rate limiting us. Please try again in a moment."
            : "The anime service is unavailable right now.",
        res.status,
      );
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Endpoints                                                                   */
/* -------------------------------------------------------------------------- */

export type TopFilter = "airing" | "upcoming" | "bypopularity" | "favorite";

export async function getTopAnime(opts: {
  filter?: TopFilter | undefined;
  limit?: number | undefined;
  page?: number | undefined;
  type?: string | undefined;
} = {}) {
  return request<Paged<Anime>>("/top/anime", {
    filter: opts.filter,
    limit: opts.limit ?? 12,
    page: opts.page,
    type: opts.type,
    sfw: "true",
  });
}

export async function getCurrentSeason(limit = 12) {
  return request<Paged<Anime>>("/seasons/now", { limit, sfw: "true" });
}

export async function searchAnime(opts: {
  q: string;
  page?: number | undefined;
  limit?: number | undefined;
  genres?: string | undefined;
  orderBy?: string | undefined;
  sort?: "asc" | "desc" | undefined;
  minScore?: number | undefined;
}) {
  return request<Paged<Anime>>("/anime", {
    q: opts.q || undefined,
    page: opts.page ?? 1,
    limit: opts.limit ?? 24,
    genres: opts.genres,
    order_by: opts.orderBy,
    sort: opts.sort,
    min_score: opts.minScore,
    sfw: "true",
  });
}

export async function getAnimeById(id: number) {
  const json = await request<{ data: Anime }>(`/anime/${id}/full`);
  return json.data;
}

export async function getAnimeRecommendations(id: number) {
  const json = await request<{ data: { entry: Anime }[] }>(`/anime/${id}/recommendations`);
  return json.data.map((r) => r.entry);
}

export async function getGenres() {
  const json = await request<{ data: Genre[] }>("/genres/anime", { filter: "genres" });
  return json.data;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export const FALLBACK_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="225" height="320"><rect width="100%" height="100%" fill="#14121c"/><text x="50%" y="50%" fill="#5b5570" font-family="sans-serif" font-size="14" text-anchor="middle">No image</text></svg>`,
  );

export function posterUrl(anime: Anime | undefined | null, size: "small" | "medium" | "large" = "medium") {
  const set = anime?.images?.webp ?? anime?.images?.jpg;
  const jpg = anime?.images?.jpg;
  const pick =
    size === "small"
      ? (set?.small_image_url ?? set?.image_url)
      : size === "large"
        ? (set?.large_image_url ?? set?.image_url)
        : (set?.image_url ?? set?.large_image_url);
  return pick ?? jpg?.image_url ?? FALLBACK_POSTER;
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function displayTitle(anime: Anime) {
  return anime.title_english?.trim() || anime.title;
}

export function truncate(text: string | null | undefined, max = 160) {
  if (!text) return "";
  const clean = text.replace(/\s*\[Written by MAL Rewrite\]\s*$/i, "").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max - 1)).trimEnd() + "…";
}

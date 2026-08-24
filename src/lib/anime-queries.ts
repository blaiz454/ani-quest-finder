import { queryOptions } from "@tanstack/react-query";
import {
  getAnimeById,
  getAnimeRecommendations,
  getCurrentSeason,
  getGenres,
  getTopAnime,
  searchAnime,
  type TopFilter,
} from "./jikan";

const HOUR = 1000 * 60 * 60;

const shared = {
  staleTime: HOUR,
  gcTime: 6 * HOUR,
  retry: 1,
} as const;

export const topAnimeQuery = (filter: TopFilter | undefined, limit = 12) =>
  queryOptions({
    queryKey: ["jikan", "top", filter ?? "all", limit],
    queryFn: () => getTopAnime({ filter, limit }),
    ...shared,
  });

export const seasonNowQuery = (limit = 12) =>
  queryOptions({
    queryKey: ["jikan", "season-now", limit],
    queryFn: () => getCurrentSeason(limit),
    ...shared,
  });

export const searchQuery = (params: { q: string; page: number; genres?: string | undefined }) =>
  queryOptions({
    queryKey: ["jikan", "search", params.q, params.page, params.genres ?? ""],
    queryFn: () =>
      searchAnime({
        q: params.q,
        page: params.page,
        genres: params.genres,
        orderBy: params.q ? undefined : "score",
        sort: params.q ? undefined : "desc",
      }),
    staleTime: 30 * 60 * 1000,
    gcTime: 6 * HOUR,
    retry: 1,
  });

export const animeQuery = (id: number) =>
  queryOptions({
    queryKey: ["jikan", "anime", id],
    queryFn: () => getAnimeById(id),
    ...shared,
  });

export const recommendationsQuery = (id: number) =>
  queryOptions({
    queryKey: ["jikan", "recommendations", id],
    queryFn: () => getAnimeRecommendations(id),
    ...shared,
  });

export const genresQuery = () =>
  queryOptions({
    queryKey: ["jikan", "genres"],
    queryFn: getGenres,
    staleTime: 24 * HOUR,
    gcTime: 24 * HOUR,
    retry: 1,
  });

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AnimeDetails } from "@/components/AnimeDetails";
import { AnimeGrid } from "@/components/AnimeGrid";
import { animeQuery, recommendationsQuery } from "@/lib/anime-queries";
import { displayTitle, truncate } from "@/lib/jikan";

export const Route = createFileRoute("/anime/$id")({
  loader: async ({ params, context }) => {
    const id = Number(params.id);
    if (!Number.isFinite(id) || id <= 0) throw notFound();
    try {
      return await context.queryClient.ensureQueryData(animeQuery(id));
    } catch {
      throw notFound();
    }
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Anime not found | AniVault" }, { name: "robots", content: "noindex" }],
      };
    }

    const anime = loaderData;
    const name = displayTitle(anime);
    const year = anime.year ?? anime.aired?.from?.slice(0, 4);
    const title = `${name} — Anime Details, Episodes, Score & Information | AniVault`;
    const description =
      truncate(
        `${name}${year ? ` (${year})` : ""}${anime.episodes ? `, ${anime.episodes} episodes` : ""}${
          anime.score ? `, scored ${anime.score}/10` : ""
        }. ${anime.synopsis ?? ""}`,
        155,
      ) || `${name} anime details, episodes, score and information on AniVault.`;
    const image =
      anime.images?.jpg?.large_image_url ??
      anime.images?.webp?.large_image_url ??
      anime.images?.jpg?.image_url;
    const url = `/anime/${params.id}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "video.tv_show" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
              { property: "og:image:alt", content: `${name} poster artwork` },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TVSeries",
            name,
            alternateName: anime.title_japanese ?? undefined,
            description: truncate(anime.synopsis, 300) || undefined,
            image: image ?? undefined,
            numberOfEpisodes: anime.episodes ?? undefined,
            genre: (anime.genres ?? []).map((g) => g.name),
            productionCompany: (anime.studios ?? []).map((s) => ({
              "@type": "Organization",
              name: s.name,
            })),
            datePublished: anime.aired?.from ?? undefined,
            aggregateRating: anime.score
              ? {
                  "@type": "AggregateRating",
                  ratingValue: anime.score,
                  bestRating: 10,
                  ratingCount: anime.scored_by ?? 1,
                }
              : undefined,
          }),
        },
      ],
    };
  },
  component: AnimeDetailPage,
});

function AnimeDetailPage() {
  const anime = Route.useLoaderData();
  const { id } = Route.useParams();
  const recs = useQuery({ ...recommendationsQuery(Number(id)), enabled: Boolean(anime) });
  const recommended = (recs.data ?? []).slice(0, 12);

  return (
    <>
      <AnimeDetails anime={anime} />

      <section
        aria-labelledby="recommended-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <h2 id="recommended-heading" className="mb-5 text-2xl font-bold sm:text-3xl">
          You might also like
        </h2>
        <AnimeGrid
          items={recommended}
          loading={recs.isPending}
          skeletonCount={12}
          emptyMessage="No recommendations are available for this title yet."
        />

        <div className="mt-10">
          <Link
            to="/search"
            search={{ q: "", page: 1 }}
            className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to results
          </Link>
        </div>
      </section>
    </>
  );
}

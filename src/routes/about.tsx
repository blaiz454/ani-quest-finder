import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Gauge, Search, Sparkles } from "lucide-react";

const TITLE = "About AniVault — Anime Discovery & Information Platform";
const DESCRIPTION =
  "AniVault is an anime discovery and information platform powered by the Jikan API and MyAnimeList data. Learn what AniVault is, how it works and where its data comes from.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const pillars = [
  {
    icon: Search,
    title: "Discovery first",
    body: "Trending, popular, top-rated and seasonal rows put thousands of titles one scroll away, with instant search across the full MyAnimeList catalogue.",
  },
  {
    icon: Database,
    title: "Real, live data",
    body: "Every score, episode count, studio, producer and trailer is fetched live from the Jikan API. Nothing on AniVault is hand-written or faked.",
  },
  {
    icon: Gauge,
    title: "Built for speed",
    body: "Cached requests, lazy-loaded imagery, loading skeletons and code-split routes keep pages fast on desktop and mobile alike.",
  },
  {
    icon: Sparkles,
    title: "Made for fans",
    body: "A dark, distraction-free interface designed for browsing late at night, on the train, or anywhere your next obsession finds you.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">About</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
        What is <span className="text-gradient">AniVault</span>?
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        AniVault is an anime discovery and information platform. It exists to answer one question
        quickly and beautifully: <em>what should I watch next?</em> Browse curated rows of trending,
        popular, top-rated and currently airing anime, search the entire catalogue, filter by genre,
        and open a dedicated page for any title with everything you need to decide.
      </p>

      <section aria-labelledby="pillars-heading" className="mt-12">
        <h2 id="pillars-heading" className="text-2xl font-bold">
          How AniVault works
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="glass rounded-2xl p-5 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                <p.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="data-heading" className="mt-12">
        <h2 id="data-heading" className="text-2xl font-bold">
          Where the data comes from
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          AniVault reads from the{" "}
          <a
            href="https://jikan.moe/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:opacity-80"
          >
            Jikan API
          </a>
          , an open, unofficial REST API for MyAnimeList. All anime titles, artwork, synopses,
          scores and rankings belong to their respective rights holders. AniVault is an independent
          project and is not affiliated with or endorsed by MyAnimeList.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          to="/search"
          className="inline-flex items-center rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
        >
          Start browsing
        </Link>
        <Link
          to="/genres"
          className="glass inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:text-accent"
        >
          Explore genres
        </Link>
      </div>
    </div>
  );
}

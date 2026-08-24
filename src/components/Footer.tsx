import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link to="/" className="group flex items-center gap-2" aria-label="AniVault home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform duration-500 group-hover:rotate-12">
              <Sparkles className="size-5 text-primary-foreground" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold">
              Ani<span className="text-gradient">Vault</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            AniVault is an anime discovery and information platform. Explore trending, popular and
            top-rated series with scores, episodes, studios and trailers — all sourced live from the
            MyAnimeList community database.
          </p>
        </div>

        <nav aria-label="Explore">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/search", label: "Browse anime" },
              { to: "/genres", label: "Genres" },
              { to: "/about", label: "About AniVault" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors duration-300 hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Data</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              Powered by the{" "}
              <a
                href="https://jikan.moe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition-opacity hover:opacity-80"
              >
                Jikan API
              </a>
            </li>
            <li>Anime data © MyAnimeList</li>
            <li>
              <a
                href="/sitemap.xml"
                className="transition-colors duration-300 hover:text-accent"
              >
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AniVault. Not affiliated with MyAnimeList.
      </div>
    </footer>
  );
}

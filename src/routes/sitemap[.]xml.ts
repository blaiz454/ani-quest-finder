import { createFileRoute } from "@tanstack/react-router";
import { getGenres, getTopAnime, slugify } from "@/lib/jikan";

function url(loc: string, priority: string, changefreq: string) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const entries: string[] = [
          url(`${origin}/`, "1.0", "daily"),
          url(`${origin}/search`, "0.7", "weekly"),
          url(`${origin}/genres`, "0.8", "weekly"),
          url(`${origin}/about`, "0.5", "monthly"),
        ];

        try {
          const genres = await getGenres();
          for (const g of genres) {
            entries.push(url(`${origin}/genre/${slugify(g.name)}`, "0.7", "weekly"));
          }
        } catch {
          /* genres unavailable — keep the static entries */
        }

        try {
          const [top, popular] = await Promise.all([
            getTopAnime({ limit: 25 }),
            getTopAnime({ filter: "bypopularity", limit: 25 }),
          ]);
          const ids = new Set([...top.data, ...popular.data].map((a) => a.mal_id));
          for (const id of ids) {
            entries.push(url(`${origin}/anime/${id}`, "0.9", "weekly"));
          }
        } catch {
          /* anime list unavailable — keep the static entries */
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

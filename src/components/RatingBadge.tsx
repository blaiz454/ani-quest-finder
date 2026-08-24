import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingBadge({
  score,
  size = "sm",
  className,
}: {
  score?: number | null;
  size?: "sm" | "lg";
  className?: string;
}) {
  const label = typeof score === "number" && score > 0 ? score.toFixed(2) : "N/A";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-gold/30 bg-background/70 font-semibold text-gold backdrop-blur-md",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className,
      )}
      aria-label={`MyAnimeList score ${label}`}
    >
      <Star className={size === "sm" ? "size-3 fill-gold" : "size-4 fill-gold"} aria-hidden="true" />
      {label}
    </span>
  );
}

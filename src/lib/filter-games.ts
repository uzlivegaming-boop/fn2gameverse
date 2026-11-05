import type { Game } from "@/types";

export type SortKey = "rating-desc" | "rating-asc" | "newest";
export interface GameFilters {
  q?: string;
  country?: string;
  category?: string;
  platform?: string;
  minRating?: number;
  sort?: SortKey;
}

export function filterGames(games: Game[], f: GameFilters): Game[] {
  const q = f.q?.trim().toLowerCase();
  const out = games.filter(
    (g) =>
      (!q || g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)) &&
      (!f.country || g.country === f.country) &&
      (!f.category || g.category === f.category) &&
      (!f.platform || g.platform === f.platform) &&
      (!f.minRating || g.rating >= f.minRating),
  );
  const sort = f.sort ?? "newest";
  return out.sort((a, b) =>
    sort === "rating-desc" ? b.rating - a.rating
    : sort === "rating-asc" ? a.rating - b.rating
    : b.createdAt.localeCompare(a.createdAt),
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search, SearchX, Star, X } from "lucide-react";
import { GameGrid } from "@/components/GameCard";
import { EmptyState, PageShell, buttonVariants } from "@/components/ui-kit";
import { CATEGORIES, COUNTRIES, PLATFORMS } from "@/data/games";
import { useGames } from "@/hooks/use-store";
import { filterGames, type GameFilters, type SortKey } from "@/lib/filter-games";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/games/")({
  validateSearch: (s: Record<string, unknown>): GameFilters => ({
    q: str(s.q),
    country: str(s.country),
    category: str(s.category),
    platform: str(s.platform),
    minRating: Number(s.minRating) >= 1 && Number(s.minRating) <= 5 ? Number(s.minRating) : undefined,
    sort: (["rating-desc", "rating-asc", "newest"] as const).includes(s.sort as SortKey) ? (s.sort as SortKey) : undefined,
  }),
  head: () => seo("Games Catalog", "Search and filter games by country, category, platform and rating."),
  component: Catalog,
});

function Catalog() {
  const f = Route.useSearch();
  const navigate = useNavigate({ from: "/games/" });
  const games = useGames();
  const results = filterGames(games, f);
  const set = (patch: Partial<GameFilters>) => navigate({ search: (p) => ({ ...p, ...patch }), replace: true });
  const hasFilters = !!(f.q || f.country || f.category || f.platform || f.minRating || f.sort);

  return (
    <PageShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Catalog</p>
          <h1 className="text-3xl font-black md:text-4xl">All games</h1>
        </div>
        <Link to="/games/add" className={buttonVariants()}><Plus size={18} /> Add game</Link>
      </div>

      <div className="card-surface mb-8 space-y-4 p-4 md:p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input className="field pl-10" placeholder="Search games…" value={f.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <select className="field" value={f.country ?? ""} onChange={(e) => set({ country: e.target.value || undefined })} aria-label="Country">
            <option value="">All countries</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="field" value={f.category ?? ""} onChange={(e) => set({ category: e.target.value || undefined })} aria-label="Category">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="field" value={f.platform ?? ""} onChange={(e) => set({ platform: e.target.value || undefined })} aria-label="Platform">
            <option value="">All platforms</option>
            {PLATFORMS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="field" value={f.sort ?? "newest"} onChange={(e) => set({ sort: e.target.value as SortKey })} aria-label="Sort">
            <option value="newest">Newest</option>
            <option value="rating-desc">Highest rating</option>
            <option value="rating-asc">Lowest rating</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1" role="group" aria-label="Minimum rating">
            <span className="mr-2 text-sm text-muted-foreground">Min rating</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} stars and up`}
                onClick={() => set({ minRating: f.minRating === n ? undefined : n })}
                className="p-1 transition hover:scale-110"
              >
                <Star size={22} className={cn(f.minRating && n <= f.minRating ? "fill-star text-star" : "text-muted-foreground/50")} />
              </button>
            ))}
          </div>
          {hasFilters && (
            <button onClick={() => navigate({ search: {}, replace: true })} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <X size={16} /> Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{results.length} game{results.length === 1 ? "" : "s"} found</p>
      {results.length ? <GameGrid games={results} /> : (
        <EmptyState icon={<SearchX />} title="No games match" text="Try a different search or clear your filters."
          action={<button onClick={() => navigate({ search: {} })} className={buttonVariants({ variant: "outline" })}>Clear filters</button>} />
      )}
    </PageShell>
  );
}

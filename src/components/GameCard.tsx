import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Monitor } from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/types";
import { SafeImage, Stars } from "@/components/ui-kit";
import { useAuth, useFavorites } from "@/hooks/use-store";
import { toggleFavorite } from "@/services/store";
import { cn } from "@/lib/utils";

export function FavoriteButton({ gameId, className }: { gameId: string; className?: string }) {
  const { user } = useAuth();
  const favs = useFavorites();
  const active = favs.includes(gameId);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return toast.error("Sign in to save favorites.");
        const on = toggleFavorite(gameId);
        toast.success(on ? "Added to favorites" : "Removed from favorites");
      }}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full glass transition hover:scale-110",
        active ? "text-primary" : "text-foreground",
        className,
      )}
    >
      <Heart size={18} className={active ? "fill-primary" : ""} />
    </button>
  );
}

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to="/games/$id"
      params={{ id: game.id }}
      className="group card-surface relative block overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <SafeImage src={game.cover} alt={game.title} className="transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-fade" />
        <span className="absolute left-3 top-3 rounded-full glass px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary">
          {game.category}
        </span>
        <FavoriteButton gameId={game.id} className="absolute right-3 top-3" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-1 text-lg font-bold">{game.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <Stars value={game.rating} size={13} />
            <span className="font-semibold">{game.rating.toFixed(1)}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Monitor size={12} />{game.platform}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={12} />{game.country}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GameGrid({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {games.map((g) => <GameCard key={g.id} game={g} />)}
    </div>
  );
}

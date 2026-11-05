import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { GameGrid } from "@/components/GameCard";
import { RequireAuth } from "@/components/RequireAuth";
import { EmptyState, PageShell, buttonVariants } from "@/components/ui-kit";
import { useFavorites, useGames } from "@/hooks/use-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/favorites")({
  head: () => seo("Favorites", "Your saved favorite games on GameVerse."),
  component: () => <RequireAuth>{() => <Favorites />}</RequireAuth>,
});

function Favorites() {
  const ids = useFavorites();
  const games = useGames();
  const favs = ids.map((id) => games.find((g) => g.id === id)).filter((g) => !!g);
  return (
    <PageShell>
      <h1 className="mb-8 text-3xl font-black md:text-4xl">Favorites <span className="text-muted-foreground">({favs.length})</span></h1>
      {favs.length ? <GameGrid games={favs} /> : (
        <EmptyState icon={<Heart />} title="No favorites yet" text="Tap the heart on any game to save it here."
          action={<Link to="/games" className={buttonVariants()}>Explore games</Link>} />
      )}
    </PageShell>
  );
}

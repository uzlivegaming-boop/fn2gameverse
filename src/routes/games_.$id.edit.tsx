import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { GameForm } from "@/components/GameForm";
import { RequireAuth } from "@/components/RequireAuth";
import { EmptyState, PageShell, buttonVariants } from "@/components/ui-kit";
import { useGames } from "@/hooks/use-store";
import { updateGame } from "@/services/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/games_/$id/edit")({
  head: () => seo("Edit Game", "Edit your game on GameVerse."),
  component: EditGame,
});

function EditGame() {
  const { id } = Route.useParams();
  const games = useGames();
  const navigate = useNavigate();
  const game = games.find((g) => g.id === id);
  return (
    <RequireAuth>
      {(user) =>
        !game || game.ownerId !== user.id ? (
          <PageShell>
            <EmptyState icon={<ShieldAlert />} title="You can't edit this game" text="Only the person who added a game can edit it."
              action={<Link to="/my-games" className={buttonVariants()}>Go to My Games</Link>} />
          </PageShell>
        ) : (
          <PageShell>
            <h1 className="mb-6 text-3xl font-black md:text-4xl">Edit {game.title}</h1>
            <GameForm
              submitLabel="Save changes"
              initial={{ title: game.title, description: game.description, cover: game.cover, category: game.category, country: game.country, platform: game.platform, rating: game.rating, website: game.website ?? "" }}
              onSubmit={(v) => {
                try {
                  updateGame(game.id, v);
                  toast.success("Game updated");
                  navigate({ to: "/games/$id", params: { id: game.id } });
                } catch (e) {
                  toast.error((e as Error).message);
                }
              }}
            />
          </PageShell>
        )
      }
    </RequireAuth>
  );
}

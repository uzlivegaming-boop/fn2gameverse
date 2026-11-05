import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { GameForm } from "@/components/GameForm";
import { RequireAuth } from "@/components/RequireAuth";
import { PageShell } from "@/components/ui-kit";
import { addGame } from "@/services/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/games/add")({
  head: () => seo("Add Game", "Add a new game to the GameVerse catalog."),
  component: AddGame,
});

function AddGame() {
  const navigate = useNavigate();
  return (
    <RequireAuth>
      {() => (
        <PageShell>
          <h1 className="mb-6 text-3xl font-black md:text-4xl">Add a new game</h1>
          <GameForm
            submitLabel="Publish game"
            onSubmit={(v) => {
              try {
                const g = addGame(v);
                toast.success("Game added!");
                navigate({ to: "/games/$id", params: { id: g.id } });
              } catch (e) {
                toast.error((e as Error).message);
              }
            }}
          />
        </PageShell>
      )}
    </RequireAuth>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Gamepad2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { RequireAuth } from "@/components/RequireAuth";
import { EmptyState, PageShell, SafeImage, Stars, buttonVariants } from "@/components/ui-kit";
import { useGames } from "@/hooks/use-store";
import { deleteGame } from "@/services/store";
import { seo } from "@/lib/seo";
import type { Game } from "@/types";

export const Route = createFileRoute("/my-games")({
  head: () => seo("My Games", "Manage the games you've added to GameVerse."),
  component: () => <RequireAuth>{(u) => <MyGames userId={u.id} />}</RequireAuth>,
});

function MyGames({ userId }: { userId: string }) {
  const mine = useGames().filter((g) => g.ownerId === userId);
  const [toDelete, setToDelete] = useState<Game | null>(null);

  return (
    <PageShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-black md:text-4xl">My games</h1>
        <Link to="/games/add" className={buttonVariants()}><Plus size={18} /> Add game</Link>
      </div>
      {mine.length === 0 ? (
        <EmptyState icon={<Gamepad2 />} title="You haven't added any games" text="Share a game you love with the community."
          action={<Link to="/games/add" className={buttonVariants()}>Add your first game</Link>} />
      ) : (
        <div className="space-y-3">
          {mine.map((g) => (
            <div key={g.id} className="card-surface flex items-center gap-4 p-3">
              <Link to="/games/$id" params={{ id: g.id }} className="h-24 w-18 shrink-0 overflow-hidden rounded-lg">
                <SafeImage src={g.cover} alt={g.title} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to="/games/$id" params={{ id: g.id }} className="line-clamp-1 font-bold hover:text-secondary">{g.title}</Link>
                <p className="text-xs text-muted-foreground">{g.category} · {g.platform} · {g.country}</p>
                <div className="mt-1"><Stars value={g.rating} size={12} /></div>
              </div>
              <div className="flex gap-2">
                <Link to="/games/$id/edit" params={{ id: g.id }} aria-label="Edit" className={buttonVariants({ variant: "outline", size: "icon" })}><Pencil size={16} /></Link>
                <button aria-label="Delete" onClick={() => setToDelete(g)} className={buttonVariants({ variant: "danger", size: "icon" })}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDelete
        open={!!toDelete}
        title={toDelete?.title ?? ""}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          try { deleteGame(toDelete.id); toast.success("Game deleted"); } catch (e) { toast.error((e as Error).message); }
          setToDelete(null);
        }}
      />
    </PageShell>
  );
}

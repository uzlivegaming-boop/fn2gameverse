import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Ghost, Globe, MapPin, Monitor, Pencil, Tag, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FavoriteButton, GameGrid } from "@/components/GameCard";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { EmptyState, PageShell, SafeImage, Stars, buttonVariants } from "@/components/ui-kit";
import { useAuth, useGames } from "@/hooks/use-store";
import { deleteGame } from "@/services/store";
import { SEED_GAMES } from "@/data/games";

export const Route = createFileRoute("/games/$id")({
  head: ({ params }) => {
    const g = SEED_GAMES.find((x) => x.id === params.id);
    const title = g ? `${g.title} | GameVerse` : "Game | GameVerse";
    const desc = g?.description ?? "Game details on GameVerse.";
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: GameDetails,
});

function GameDetails() {
  const { id } = Route.useParams();
  const games = useGames();
  const { user } = useAuth();
  const navigate = useNavigate();
  const game = games.find((g) => g.id === id);
  const [shot, setShot] = useState(0);
  const [confirm, setConfirm] = useState(false);

  if (!game)
    return (
      <PageShell>
        <EmptyState icon={<Ghost />} title="Game not found" text="This game doesn't exist or was removed."
          action={<Link to="/games" className={buttonVariants()}>Browse games</Link>} />
      </PageShell>
    );

  const isOwner = !!user && game.ownerId === user.id;
  const related = games.filter((g) => g.id !== game.id && g.category === game.category).slice(0, 4);
  const others = games.filter((g) => g.id !== game.id);
  const gallery = [game.cover, ...others.filter((g) => g.category === game.category).concat(others).slice(0, 3).map((g) => g.cover)];
  const positions = ["object-center", "object-top", "object-bottom", "object-left"];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10"><SafeImage src={game.cover} alt="" eager className="scale-110 blur-2xl opacity-40" /></div>
        <div className="absolute inset-0 -z-10 bg-gradient-fade" />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-6 md:pt-10">
          <Link to="/games" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6" })}><ArrowLeft size={16} /> Back to games</Link>
          <div className="grid gap-8 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr]">
            <div className="card-surface aspect-[3/4] overflow-hidden shadow-glow">
              <SafeImage src={game.cover} alt={game.title} eager />
            </div>
            <div className="animate-rise">
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">{game.category}</span>
              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{game.title}</h1>
              <div className="mt-4 flex items-center gap-3">
                <Stars value={game.rating} size={20} />
                <span className="text-xl font-bold">{game.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">/ 5</span>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{game.description}</p>
              <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Tag, label: "Category", v: game.category },
                  { icon: MapPin, label: "Country", v: game.country },
                  { icon: Monitor, label: "Platform", v: game.platform },
                  { icon: Users, label: "Players", v: game.players ? `${(game.players / 1e6).toFixed(1)}M` : "New" },
                ].map((i) => (
                  <div key={i.label} className="card-surface p-3">
                    <i.icon size={16} className="text-secondary" />
                    <p className="mt-2 text-xs text-muted-foreground">{i.label}</p>
                    <p className="font-semibold">{i.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <FavoriteButton gameId={game.id} className="h-12 w-12" />
                {game.website ? (
                  <a href={game.website} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg" })}><Globe size={18} /> Official website <ExternalLink size={14} /></a>
                ) : (
                  <span className="text-sm text-muted-foreground">No official website listed</span>
                )}
                {isOwner && (
                  <>
                    <Link to="/games/$id/edit" params={{ id: game.id }} className={buttonVariants({ variant: "outline", size: "lg" })}><Pencil size={16} /> Edit</Link>
                    <button onClick={() => setConfirm(true)} className={buttonVariants({ variant: "danger", size: "lg" })}><Trash2 size={16} /> Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageShell className="space-y-14 pt-4">
        <section>
          <h2 className="mb-4 text-2xl font-extrabold">Screenshots</h2>
          <div className="card-surface aspect-video overflow-hidden">
            <SafeImage src={gallery[shot]} alt={`${game.title} screenshot ${shot + 1}`} className={positions[shot]} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <button key={i} onClick={() => setShot(i)} className={`aspect-video overflow-hidden rounded-lg border-2 transition ${i === shot ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                <SafeImage src={src} alt={`Thumbnail ${i + 1}`} className={positions[i]} />
              </button>
            ))}
          </div>
        </section>
        {related.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-extrabold">More {game.category} games</h2>
            <GameGrid games={related} />
          </section>
        )}
      </PageShell>

      <ConfirmDelete
        open={confirm}
        title={game.title}
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          try {
            deleteGame(game.id);
            toast.success("Game deleted");
            navigate({ to: "/my-games" });
          } catch (e) {
            toast.error((e as Error).message);
          }
        }}
      />
    </>
  );
}

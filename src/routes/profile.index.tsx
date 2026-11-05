import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Mail, MapPin, Pencil } from "lucide-react";
import { GameGrid } from "@/components/GameCard";
import { RequireAuth } from "@/components/RequireAuth";
import { Avatar, PageShell, SectionTitle, buttonVariants } from "@/components/ui-kit";
import { useFavorites, useGames } from "@/hooks/use-store";
import { seo } from "@/lib/seo";
import type { User } from "@/types";

export const Route = createFileRoute("/profile/")({
  head: () => seo("Profile", "Your GameVerse player profile."),
  component: () => <RequireAuth>{(u) => <Profile user={u} />}</RequireAuth>,
});

function Profile({ user }: { user: User }) {
  const games = useGames();
  const favIds = useFavorites();
  const mine = games.filter((g) => g.ownerId === user.id);
  const favs = games.filter((g) => favIds.includes(g.id));
  return (
    <PageShell className="space-y-14">
      <section className="card-surface overflow-hidden">
        <div className="h-32 bg-gradient-brand opacity-80 md:h-44" />
        <div className="flex flex-col gap-5 px-6 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="-mt-12 flex flex-col gap-4 md:flex-row md:items-end">
            <Avatar name={user.username} src={user.avatar} size={104} />
            <div>
              <h1 className="text-3xl font-black">{user.username}</h1>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Mail size={14} />{user.email}</span>
                {user.country && <span className="inline-flex items-center gap-1"><MapPin size={14} />{user.country}</span>}
                <span className="inline-flex items-center gap-1"><CalendarDays size={14} />Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Link to="/profile/edit" className={buttonVariants({ variant: "outline" })}><Pencil size={16} /> Edit profile</Link>
        </div>
        <p className="border-t border-border px-6 py-5 text-muted-foreground">{user.bio || "No biography yet. Tell the community about your favorite games!"}</p>
      </section>
      <section>
        <SectionTitle title={`Added games (${mine.length})`} />
        {mine.length ? <GameGrid games={mine} /> : <p className="text-sm text-muted-foreground">No games added yet. <Link to="/games/add" className="text-secondary hover:underline">Add one</Link></p>}
      </section>
      <section>
        <SectionTitle title={`Favorites (${favs.length})`} />
        {favs.length ? <GameGrid games={favs} /> : <p className="text-sm text-muted-foreground">No favorites yet. <Link to="/games" className="text-secondary hover:underline">Browse games</Link></p>}
      </section>
    </PageShell>
  );
}

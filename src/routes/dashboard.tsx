import { createFileRoute, Link } from "@tanstack/react-router";
import { Gamepad2, Heart, Plus, Search, Settings, Star, UserRound } from "lucide-react";
import { GameGrid } from "@/components/GameCard";
import { RequireAuth } from "@/components/RequireAuth";
import { Avatar, PageShell, SectionTitle, buttonVariants } from "@/components/ui-kit";
import { useFavorites, useGames } from "@/hooks/use-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () => seo("Dashboard", "Your personal GameVerse dashboard."),
  component: () => <RequireAuth>{(u) => <Dashboard userId={u.id} username={u.username} email={u.email} avatar={u.avatar} bio={u.bio} />}</RequireAuth>,
});

function Dashboard({ userId, username, email, avatar, bio }: { userId: string; username: string; email: string; avatar?: string; bio: string }) {
  const games = useGames();
  const favIds = useFavorites();
  const mine = games.filter((g) => g.ownerId === userId);
  const favs = games.filter((g) => favIds.includes(g.id));
  const recent = [...games].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const popular = [...games].sort((a, b) => (b.players ?? 0) - (a.players ?? 0)).slice(0, 4);
  const favCats = new Set(favs.map((f) => f.category));
  const recommended = games
    .filter((g) => !favIds.includes(g.id) && (favCats.size === 0 || favCats.has(g.category)))
    .sort((a, b) => b.rating - a.rating).slice(0, 4);
  const avg = favs.length ? (favs.reduce((s, g) => s + g.rating, 0) / favs.length).toFixed(1) : "—";

  const stats = [
    { icon: Gamepad2, label: "Games added", v: mine.length },
    { icon: Heart, label: "Favorites", v: favs.length },
    { icon: Star, label: "Avg fav rating", v: avg },
    { icon: Search, label: "In catalog", v: games.length },
  ];
  const actions = [
    { to: "/games/add", icon: Plus, label: "Add game" },
    { to: "/games", icon: Search, label: "Browse" },
    { to: "/profile", icon: UserRound, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ] as const;

  return (
    <PageShell className="space-y-14">
      <section className="card-surface relative overflow-hidden p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-primary/25 blur-3xl animate-glow" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={username} src={avatar} size={68} />
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h1 className="text-3xl font-black">{username}</h1>
              <p className="text-sm text-muted-foreground">{bio || email}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className="flex flex-col items-center gap-1.5 rounded-xl bg-background/60 px-3 py-3 text-xs font-semibold transition hover:bg-accent">
                <a.icon size={20} className="text-secondary" />{a.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-5">
            <s.icon size={20} className="mb-2 text-primary" />
            <p className="text-3xl font-black">{s.v}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle eyebrow="Your collection" title="Favorite games" action={<Link to="/favorites" className="text-sm font-semibold text-secondary hover:underline">See all</Link>} />
        {favs.length ? <GameGrid games={favs.slice(0, 4)} /> : (
          <div className="card-surface p-6 text-sm text-muted-foreground">No favorites yet. Tap the heart on any game. <Link to="/games" className={buttonVariants({ variant: "outline", size: "sm", className: "ml-2" })}>Browse games</Link></div>
        )}
      </section>
      <section><SectionTitle eyebrow="For you" title="Recommended" /><GameGrid games={recommended} /></section>
      <section><SectionTitle eyebrow="Fresh" title="Recently added" /><GameGrid games={recent} /></section>
      <section><SectionTitle eyebrow="Trending" title="Popular games" /><GameGrid games={popular} /></section>
    </PageShell>
  );
}

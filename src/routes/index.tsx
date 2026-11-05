import { createFileRoute, Link } from "@tanstack/react-router";
import { Gamepad2, MessageCircle, Sparkles, Trophy, Users } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { LogoMark } from "@/components/Logo";
import { GameGrid } from "@/components/GameCard";
import { SafeImage, SectionTitle, buttonVariants, Avatar } from "@/components/ui-kit";
import { CATEGORIES, CATEGORY_COVER } from "@/data/games";
import { useGames } from "@/hooks/use-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Enter the World of Gaming", "GameVerse is a premium gaming platform to discover, rate and collect the best games."),
  component: Home,
});

const STATS = [
  { icon: Gamepad2, value: "12K+", label: "Games listed" },
  { icon: Users, value: "2.4M", label: "Active players" },
  { icon: Trophy, value: "860", label: "Tournaments" },
  { icon: MessageCircle, value: "45K", label: "Daily reviews" },
];

function Home() {
  const games = useGames();
  const featured = [...games].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const popular = [...games].sort((a, b) => (b.players ?? 0) - (a.players ?? 0)).slice(0, 8);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-fade" />
        <div className="absolute -left-20 top-20 -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-glow" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 md:px-6 md:pb-24">
          <div className="max-w-2xl animate-rise">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-semibold">
              <LogoMark size={18} /> GAMEVERSE · Season 1
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              ENTER THE WORLD OF <span className="text-gradient">GAMING</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              Discover epic titles, build your collection and share your favorites with a global community of players.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/games" className={buttonVariants({ size: "lg" })}><Sparkles size={18} /> Explore Games</Link>
              <Link to="/register" className={buttonVariants({ variant: "outline", size: "lg" })}>Join GameVerse</Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-20 px-4 py-16 md:px-6">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {STATS.map((s) => (
            <div key={s.label} className="card-surface p-5">
              <s.icon className="mb-3 text-secondary" size={22} />
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section>
          <SectionTitle eyebrow="Top rated" title="Featured games" action={<Link to="/games" className="text-sm font-semibold text-secondary hover:underline">View all</Link>} />
          <GameGrid games={featured} />
        </section>

        <section>
          <SectionTitle eyebrow="Browse" title="Game categories" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link key={c} to="/games" search={{ category: c }} className="group card-surface relative aspect-[16/10] overflow-hidden">
                <SafeImage src={CATEGORY_COVER[c]} alt={c} className="transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-fade" />
                <span className="absolute bottom-3 left-3 text-lg font-bold">{c}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Most played" title="Popular right now" />
          <GameGrid games={popular} />
        </section>

        <section className="card-surface relative overflow-hidden p-8 md:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-glow" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Community</p>
              <h2 className="text-3xl font-black md:text-4xl">Play together. Rank together.</h2>
              <p className="mt-3 text-muted-foreground">Share your collection, add new titles and find your next obsession through players like you.</p>
              <Link to="/register" className={buttonVariants({ className: "mt-6" })}>Create free account</Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Shadow", "Nova", "Kairo", "Lumi", "Azamat", "Rex", "Yuki", "Zara"].map((n) => (
                <div key={n} className="flex items-center gap-2 rounded-full bg-background/60 py-1.5 pl-1.5 pr-4">
                  <Avatar name={n} size={34} />
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-black tracking-[0.12em]">GAME<span className="text-gradient">VERSE</span></span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Discover, collect and share the games you love. Built mobile-first and ready for Telegram.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/games" className="hover:text-foreground">Games catalog</Link></li>
            <li><Link to="/games/add" className="hover:text-foreground">Add a game</Link></li>
            <li><Link to="/favorites" className="hover:text-foreground">Favorites</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/settings" className="hover:text-foreground">Settings</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Join GameVerse</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GameVerse. Demo mode — data is stored in your browser.
      </div>
    </footer>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Avatar, buttonVariants } from "@/components/ui-kit";
import { useAuth } from "@/hooks/use-store";
import { logout } from "@/services/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/games", label: "Games" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-games", label: "My Games" },
  { to: "/favorites", label: "Favorites" },
] as const;

const linkCls = "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground";
const activeCls = { className: "text-foreground bg-accent" };

export function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    setOpen(false);
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls} activeProps={activeCls} activeOptions={{ exact: l.to === "/" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-accent">
                <Avatar name={user.username} src={user.avatar} size={32} />
                <span className="text-sm font-semibold">{user.username}</span>
              </Link>
              <button onClick={doLogout} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>Login</Link>
              <Link to="/register" className={buttonVariants({ size: "sm" })}>Register</Link>
            </>
          )}
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-accent lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border px-4 pb-5 pt-3 lg:hidden animate-rise">
          {user && (
            <Link to="/profile" onClick={() => setOpen(false)} className="mb-3 flex items-center gap-3 rounded-xl bg-card p-3">
              <Avatar name={user.username} src={user.avatar} size={40} />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </Link>
          )}
          <nav className="flex flex-col">
            {[...LINKS, { to: "/about", label: "About" } as const, { to: "/settings", label: "Settings" } as const].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={cn(linkCls, "py-3 text-base")} activeProps={activeCls} activeOptions={{ exact: l.to === "/" }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {user ? (
              <button onClick={doLogout} className={cn(buttonVariants({ variant: "outline" }), "col-span-2")}><LogOut size={16} /> Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className={buttonVariants({ variant: "outline" })}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className={buttonVariants()}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

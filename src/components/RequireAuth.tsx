import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-store";
import { EmptyState, PageShell, buttonVariants } from "@/components/ui-kit";
import type { User } from "@/types";

/** Client-side gate for demo mode (session lives in localStorage). */
export function RequireAuth({ children }: { children: (user: User) => ReactNode }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <PageShell><div className="h-64 animate-pulse rounded-2xl bg-card" /></PageShell>;
  if (!user)
    return (
      <PageShell>
        <EmptyState
          icon={<Lock />}
          title="Sign in required"
          text="Log in or create a free account to access this page."
          action={
            <div className="flex gap-2">
              <Link to="/login" className={buttonVariants({ variant: "outline" })}>Login</Link>
              <Link to="/register" className={buttonVariants()}>Register</Link>
            </div>
          }
        />
      </PageShell>
    );
  return <>{children(user)}</>;
}

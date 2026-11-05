import type { ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import { LogoMark } from "@/components/Logo";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:px-6">
      <div className="relative hidden h-[560px] overflow-hidden rounded-3xl md:block">
        <img src={hero} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-fade" />
        <div className="absolute bottom-8 left-8 right-8">
          <LogoMark size={44} />
          <p className="mt-4 text-3xl font-black">Your universe of games awaits.</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
        <div className="mt-4 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2 text-xs text-secondary">
          Local demo mode: accounts are stored only in this browser. No real server is connected.
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

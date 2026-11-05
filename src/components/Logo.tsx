import { Link } from "@tanstack/react-router";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id="gv-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
      <path d="M20 2 36 11v18L20 38 4 29V11Z" fill="url(#gv-g)" />
      <path d="M20 7 31.5 13.5v13L20 33 8.5 26.5v-13Z" fill="var(--background)" />
      <path d="M13 18h5v-3h4v3h5v4h-5v3h-4v-3h-5Z" fill="url(#gv-g)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="GameVerse home">
      <LogoMark />
      <span className="text-lg font-black tracking-[0.12em]">
        GAME<span className="text-gradient">VERSE</span>
      </span>
    </Link>
  );
}

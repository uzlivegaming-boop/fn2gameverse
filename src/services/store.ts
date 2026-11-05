/**
 * LOCAL DEMO MODE storage. Everything is saved in this browser's localStorage.
 * No real backend is connected. Passwords are hashed client-side only for demo
 * purposes — this is NOT production security.
 */
import { SEED_GAMES } from "@/data/games";
import type { Game, Settings, User } from "@/types";

const KEYS = {
  users: "gv_users",
  creds: "gv_creds",
  session: "gv_session",
  games: "gv_games",
  favs: "gv_favs",
  settings: "gv_settings",
};

type Creds = Record<string, { userId: string; hash: string }>;

interface State {
  users: User[];
  creds: Creds;
  sessionId: string | null;
  games: Game[]; // user-created games
  favs: Record<string, string[]>;
  settings: Settings;
}

const DEFAULT_SETTINGS: Settings = { notifications: true, reducedMotion: false, publicProfile: true };

const read = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

let state: State | null = null;
const listeners = new Set<() => void>();
const SERVER_STATE: State = { users: [], creds: {}, sessionId: null, games: [], favs: {}, settings: DEFAULT_SETTINGS };

function load(): State {
  if (typeof window === "undefined") return SERVER_STATE;
  if (!state) {
    state = {
      users: read(KEYS.users, []),
      creds: read(KEYS.creds, {}),
      sessionId: read(KEYS.session, null),
      games: read(KEYS.games, []),
      favs: read(KEYS.favs, {}),
      settings: read(KEYS.settings, DEFAULT_SETTINGS),
    };
  }
  return state;
}

function set(patch: Partial<State>) {
  state = { ...load(), ...patch };
  if (patch.users) write(KEYS.users, state.users);
  if (patch.creds) write(KEYS.creds, state.creds);
  if ("sessionId" in patch) write(KEYS.session, state.sessionId);
  if (patch.games) write(KEYS.games, state.games);
  if (patch.favs) write(KEYS.favs, state.favs);
  if (patch.settings) write(KEYS.settings, state.settings);
  listeners.forEach((l) => l());
}

export const store = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot: load,
  getServerSnapshot: () => SERVER_STATE,
};

async function hash(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
const uid = () => crypto.randomUUID();
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// ---------- selectors ----------
export const selectUser = (s: State) => s.users.find((u) => u.id === s.sessionId) ?? null;
export const selectAllGames = (s: State): Game[] => [...s.games, ...SEED_GAMES];
export const selectFavIds = (s: State) => (s.sessionId ? s.favs[s.sessionId] ?? [] : []);

// ---------- auth ----------
export async function register(username: string, email: string, password: string) {
  await delay();
  const s = load();
  const key = email.trim().toLowerCase();
  if (s.creds[key]) throw new Error("An account with this email already exists.");
  if (s.users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase()))
    throw new Error("This username is taken.");
  const user: User = {
    id: uid(), username: username.trim(), email: key, bio: "", country: "", createdAt: new Date().toISOString(),
  };
  set({
    users: [...s.users, user],
    creds: { ...s.creds, [key]: { userId: user.id, hash: await hash(password) } },
    sessionId: user.id,
  });
  return user;
}

export async function login(email: string, password: string) {
  await delay();
  const s = load();
  const c = s.creds[email.trim().toLowerCase()];
  if (!c || c.hash !== (await hash(password))) throw new Error("Invalid email or password.");
  set({ sessionId: c.userId });
}

export function logout() {
  set({ sessionId: null });
}

export function updateProfile(patch: Partial<Pick<User, "username" | "bio" | "country" | "avatar">>) {
  const s = load();
  if (!s.sessionId) throw new Error("Not signed in");
  if (patch.username && s.users.some((u) => u.id !== s.sessionId && u.username.toLowerCase() === patch.username!.toLowerCase()))
    throw new Error("This username is taken.");
  set({ users: s.users.map((u) => (u.id === s.sessionId ? { ...u, ...patch } : u)) });
}

// ---------- games ----------
export type GameInput = Omit<Game, "id" | "createdAt" | "ownerId" | "players">;

export function addGame(input: GameInput) {
  const s = load();
  if (!s.sessionId) throw new Error("Sign in to add games.");
  const game: Game = { ...input, id: uid(), createdAt: new Date().toISOString(), ownerId: s.sessionId, players: 0 };
  set({ games: [game, ...s.games] });
  return game;
}

export function updateGame(id: string, input: GameInput) {
  const s = load();
  const g = s.games.find((x) => x.id === id);
  if (!g || g.ownerId !== s.sessionId) throw new Error("You can only edit your own games.");
  set({ games: s.games.map((x) => (x.id === id ? { ...x, ...input } : x)) });
}

export function deleteGame(id: string) {
  const s = load();
  const g = s.games.find((x) => x.id === id);
  if (!g || g.ownerId !== s.sessionId) throw new Error("You can only delete your own games.");
  const favs = Object.fromEntries(Object.entries(s.favs).map(([k, v]) => [k, v.filter((f) => f !== id)]));
  set({ games: s.games.filter((x) => x.id !== id), favs });
}

export function toggleFavorite(gameId: string) {
  const s = load();
  if (!s.sessionId) throw new Error("Sign in to save favorites.");
  const cur = s.favs[s.sessionId] ?? [];
  const next = cur.includes(gameId) ? cur.filter((x) => x !== gameId) : [gameId, ...cur];
  set({ favs: { ...s.favs, [s.sessionId]: next } });
  return next.includes(gameId);
}

export function updateSettings(patch: Partial<Settings>) {
  set({ settings: { ...load().settings, ...patch } });
}

export function resetDemoData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  state = null;
  listeners.forEach((l) => l());
}

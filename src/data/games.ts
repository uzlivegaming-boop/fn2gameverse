import type { Category, Game, Platform } from "@/types";
import neon from "@/assets/games/neon-protocol.jpg";
import dragon from "@/assets/games/dragon-oath.jpg";
import stellar from "@/assets/games/stellar-siege.jpg";
import velocity from "@/assets/games/velocity-rush.jpg";
import silent from "@/assets/games/silent-ward.jpg";
import iron from "@/assets/games/iron-front.jpg";
import sky from "@/assets/games/sky-realms.jpg";
import ronin from "@/assets/games/ronin-blade.jpg";
import goal from "@/assets/games/goal-legends.jpg";
import silk from "@/assets/games/silk-empire.jpg";
import ash from "@/assets/games/ashfall.jpg";
import echo from "@/assets/games/echo-depths.jpg";

export const CATEGORIES: Category[] = [
  "Action", "RPG", "Shooter", "Racing", "Horror", "Adventure", "Strategy", "Sports", "Puzzle",
];
export const PLATFORMS: Platform[] = ["PC", "PlayStation", "Xbox", "Switch", "Mobile"];
export const COUNTRIES = [
  "USA", "Japan", "Uzbekistan", "Poland", "Sweden", "France", "UK", "South Korea", "Canada", "Germany",
];

const d = (n: number) => new Date(Date.UTC(2026, 0, 1) + n * 86400000).toISOString();

export const SEED_GAMES: Game[] = [
  { id: "neon-protocol", title: "Neon Protocol", cover: neon, category: "Action", country: "Poland", platform: "PC", rating: 4.8, players: 3200000, website: "https://example.com/neon-protocol", createdAt: d(300),
    description: "Hack, sprint and fight across a rain-soaked megacity where every billboard watches you. A narrative action game about memory, rebellion and neon nights." },
  { id: "dragon-oath", title: "Dragon Oath", cover: dragon, category: "RPG", country: "Japan", platform: "PlayStation", rating: 4.9, players: 5400000, website: "https://example.com/dragon-oath", createdAt: d(280),
    description: "Swear your blade to a dying kingdom and face ancient dragons in a vast open-world RPG with deep crafting and branching quests." },
  { id: "stellar-siege", title: "Stellar Siege", cover: stellar, category: "Shooter", country: "Sweden", platform: "Xbox", rating: 4.5, players: 2100000, createdAt: d(250),
    description: "Command a nimble starfighter in large-scale fleet battles above gas giants. Squad up with friends in 32-player space warfare." },
  { id: "velocity-rush", title: "Velocity Rush", cover: velocity, category: "Racing", country: "UK", platform: "PC", rating: 4.4, players: 1800000, website: "https://example.com/velocity-rush", createdAt: d(320),
    description: "Drift through endless neon highways in an arcade racer built for speed. Tune hundreds of cars and climb the global leaderboards." },
  { id: "silent-ward", title: "Silent Ward", cover: silent, category: "Horror", country: "USA", platform: "PlayStation", rating: 4.2, players: 900000, createdAt: d(200),
    description: "Survive one night inside an abandoned hospital with only a flashlight. Psychological horror where the building remembers everything." },
  { id: "iron-front", title: "Iron Front", cover: iron, category: "Shooter", country: "USA", platform: "Xbox", rating: 4.3, players: 4100000, website: "https://example.com/iron-front", createdAt: d(150),
    description: "Tactical squad-based combat in sandstorm-swept deserts. Realistic ballistics, destructible maps and intense 64-player operations." },
  { id: "sky-realms", title: "Sky Realms", cover: sky, category: "Adventure", country: "France", platform: "Switch", rating: 4.7, players: 2600000, createdAt: d(330),
    description: "Explore floating islands, ride airships and befriend a loyal fox companion in a cozy, colorful open-air adventure." },
  { id: "ronin-blade", title: "Ronin Blade", cover: ronin, category: "Action", country: "Japan", platform: "PC", rating: 4.6, players: 2900000, website: "https://example.com/ronin-blade", createdAt: d(220),
    description: "A masterless samurai seeks vengeance beneath a blood moon. Precise, punishing swordplay in feudal Japan." },
  { id: "goal-legends", title: "Goal Legends", cover: goal, category: "Sports", country: "Germany", platform: "Mobile", rating: 4.1, players: 8700000, createdAt: d(310),
    description: "Build your dream club and play fast-paced football matches against friends worldwide. Weekly tournaments and live events." },
  { id: "silk-empire", title: "Silk Empire", cover: silk, category: "Strategy", country: "Uzbekistan", platform: "PC", rating: 4.7, players: 1200000, website: "https://example.com/silk-empire", createdAt: d(340),
    description: "Rule the cities of the Great Silk Road. Grow Samarkand into a legendary capital through trade, diplomacy and conquest." },
  { id: "ashfall", title: "Ashfall", cover: ash, category: "Adventure", country: "Canada", platform: "PlayStation", rating: 4.5, players: 3300000, createdAt: d(180),
    description: "Scavenge, craft and survive in an overgrown world reclaimed by nature. A post-apocalyptic open world full of quiet beauty." },
  { id: "echo-depths", title: "Echo Depths", cover: echo, category: "Puzzle", country: "South Korea", platform: "Switch", rating: 4.0, players: 600000, createdAt: d(260),
    description: "Guide a tiny robot through glowing underwater ruins, solving light-and-sound puzzles to awaken a sunken civilization." },
];

export const CATEGORY_COVER: Record<Category, string> = {
  Action: ronin, RPG: dragon, Shooter: iron, Racing: velocity, Horror: silent,
  Adventure: sky, Strategy: silk, Sports: goal, Puzzle: echo,
};

export const FALLBACK_COVER = neon;

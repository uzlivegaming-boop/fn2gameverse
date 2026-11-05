export type Category =
  | "Action"
  | "RPG"
  | "Shooter"
  | "Racing"
  | "Horror"
  | "Adventure"
  | "Strategy"
  | "Sports"
  | "Puzzle";

export type Platform = "PC" | "PlayStation" | "Xbox" | "Switch" | "Mobile";

export interface Game {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: Category;
  country: string;
  platform: Platform;
  rating: number;
  website?: string;
  createdAt: string;
  ownerId?: string;
  players?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  country: string;
  avatar?: string;
  createdAt: string;
}

export interface Settings {
  notifications: boolean;
  reducedMotion: boolean;
  publicProfile: boolean;
}

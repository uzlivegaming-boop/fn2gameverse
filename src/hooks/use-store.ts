import { useSyncExternalStore } from "react";
import { store, selectAllGames, selectFavIds, selectUser } from "@/services/store";

export function useAppState() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

export function useAuth() {
  const s = useAppState();
  return { user: selectUser(s), ready: typeof window !== "undefined" };
}

export function useGames() {
  return selectAllGames(useAppState());
}

export function useFavorites() {
  return selectFavIds(useAppState());
}

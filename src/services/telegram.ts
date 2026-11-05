/**
 * Telegram Mini App integration (prepared, not active).
 * Works only when the site is opened inside Telegram and the
 * telegram-web-app.js script is loaded. Never fakes authentication:
 * initData must be verified on a server before trusting the user.
 */
interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: { id: number; username?: string; first_name?: string } };
  ready: () => void;
  expand: () => void;
  colorScheme?: "light" | "dark";
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  const app = window.Telegram?.WebApp;
  return app && app.initData ? app : null;
}

export function isTelegramMiniApp() {
  return getTelegramWebApp() !== null;
}

export function initTelegram() {
  const app = getTelegramWebApp();
  if (!app) return;
  app.ready();
  app.expand();
}

/** Raw initData to send to a future backend for signature verification. */
export function getTelegramInitData(): string | null {
  return getTelegramWebApp()?.initData ?? null;
}

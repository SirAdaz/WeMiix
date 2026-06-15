export type AppMode = "adult" | "child";

const MODE_KEY = "wemiix_mode";

export function getMode(): AppMode {
  if (typeof window === "undefined") return "adult";
  return (localStorage.getItem(MODE_KEY) as AppMode) ?? "adult";
}

export function setMode(mode: AppMode): void {
  localStorage.setItem(MODE_KEY, mode);
}

export function isChildMode(): boolean {
  return getMode() === "child";
}

/** Filtre le contenu explicite selon le mode actif */
export function filterExplicit(text: string, mode: AppMode): string {
  if (mode === "adult") return text;
  return text
    .replace(/\b(fuck|shit|bitch|ass|sex|nude|explicit)\b/gi, "***")
    .replace(/\b(putain|merde|salope|cul|baiser|nichons)\b/gi, "***");
}

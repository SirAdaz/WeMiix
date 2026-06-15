"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "Accueil", emoji: "🏠" },
  { href: "/karaoke", label: "Karaoké", emoji: "🎤" },
  { href: "/blindtest", label: "Blind Test", emoji: "🎵" },
  { href: "/playlists", label: "Playlists", emoji: "🎶" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
    >
      <ul className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, emoji }) => {
          const isActive = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center justify-center gap-0.5 h-full transition-colors"
                style={{ color: isActive ? "var(--pink)" : "var(--bg-muted)" }}
              >
                <span className="text-xl leading-none">{emoji}</span>
                <span className="text-[10px] font-bold">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

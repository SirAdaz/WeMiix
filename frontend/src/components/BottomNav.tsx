"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}

const baseHref = (groupId: string): NavItem[] => [
  {
    href: `/groupe/${groupId}`,
    label: "Accueil",
    icon: <HomeIcon />,
    activeColor: "var(--green)",
  },
  {
    href: `/groupe/${groupId}/karaoke`,
    label: "Karaoké",
    icon: <MicIcon />,
    activeColor: "var(--green)",
  },
  {
    href: `/groupe/${groupId}/blind-test`,
    label: "Blind test",
    icon: <MusicIcon />,
    activeColor: "var(--pink)",
  },
  {
    href: `/groupe/${groupId}/playlist`,
    label: "Playlist",
    icon: <ListIcon />,
    activeColor: "var(--green)",
  },
  {
    href: `/groupe/${groupId}/mini-jeux`,
    label: "Mini-jeux",
    icon: <GameIcon />,
    activeColor: "var(--pink)",
  },
];

export default function BottomNav({ groupId }: { groupId: string }) {
  const pathname = usePathname();
  const items = baseHref(groupId);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pb-safe border-t"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--bg-muted)",
        paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)",
        paddingTop: "0.5rem",
      }}
    >
      {items.map((item) => {
        const isActive =
          item.href === `/groupe/${groupId}`
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 min-w-0 flex-1 py-1 transition-transform active:scale-90"
          >
            <span
              className="w-6 h-6 transition-colors"
              style={{ color: isActive ? item.activeColor : "var(--bg-muted)" }}
            >
              {item.icon}
            </span>
            <span
              className="text-[10px] font-semibold truncate"
              style={{ color: isActive ? item.activeColor : "var(--bg-muted)" }}
            >
              {item.label}
            </span>
            {isActive && (
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: item.activeColor }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
    </svg>
  );
}

function GameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>
    </svg>
  );
}

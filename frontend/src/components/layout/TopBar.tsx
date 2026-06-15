"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface TopBarProps {
  pageTitle?: string;
}

const HOME_ROUTES = ["/home", "/groupe"];

function WeMiixLogo() {
  return (
    <Link href="/home" className="flex items-center select-none">
      <span className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-league-spartan)" }}>
        <span style={{ color: "var(--green)" }}>We</span>
        <span style={{ color: "var(--light)" }}>M</span>
        <span style={{ color: "var(--pink)" }}>ii</span>
        <span style={{ color: "var(--light)" }}>x</span>
      </span>
    </Link>
  );
}

export default function TopBar({ pageTitle }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isRoot = HOME_ROUTES.some((r) => pathname === r);
  const showBack = !isRoot;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b"
      style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
    >
      {/* Gauche : back ou logo */}
      {showBack ? (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-semibold text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--light)" }}
          aria-label="Retour"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Retour
        </button>
      ) : (
        <WeMiixLogo />
      )}

      {/* Centre : titre de page */}
      {pageTitle && (
        <h1
          className="absolute left-1/2 -translate-x-1/2 text-base font-bold"
          style={{ color: "var(--light)" }}
        >
          {pageTitle}
        </h1>
      )}

      {/* Droite : profil */}
      <Link
        href="/profil"
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors hover:bg-white/10"
        style={{ background: "var(--bg-muted)", color: "var(--light)" }}
        aria-label="Mon profil"
      >
        👤
      </Link>
    </header>
  );
}

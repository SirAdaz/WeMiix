import Link from "next/link";

interface TopBarProps {
  pageTitle?: string;
}

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
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b"
      style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
    >
      <WeMiixLogo />

      {pageTitle && (
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-light">
          {pageTitle}
        </h1>
      )}

      <Link
        href="/profile"
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors hover:bg-white/10"
        style={{ background: "var(--bg-muted)", color: "var(--light)" }}
        aria-label="Mon profil"
      >
        👤
      </Link>
    </header>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-deep)" }}>

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <WeMiixLogo />
        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="text-sm font-semibold hover:text-light transition-colors px-4 py-2"
            style={{ color: "var(--bg-muted)" }}
          >
            Connexion
          </Link>
          <Link
            href="/groupe"
            className="text-sm font-bold px-5 py-2.5 rounded-full text-white transition-all hover:scale-105 glow-pink"
            style={{ background: "var(--pink)" }}
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 gap-8">
        {/* Vinyl animé */}
        <div className="relative w-24 h-24 float-anim">
          <VinylRecord />
        </div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tight">
            <span className="gradient-text-brand">Fais vibrer</span>
            <br />
            <span style={{ color: "var(--light)" }}>ta soirée</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed" style={{ color: "var(--bg-muted)" }}>
            Karaoké, blind test et mini-jeux musicaux en temps réel avec tes amis.
            Une seule app, une soirée inoubliable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            href="/groupe"
            className="flex-1 py-3.5 rounded-full font-bold text-white text-base transition-all hover:scale-105 glow-pink text-center"
            style={{ background: "var(--pink)" }}
          >
            🚀 Lancer une session
          </Link>
          <Link
            href="/groupe"
            className="flex-1 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 glow-green text-center"
            style={{ background: "var(--green)", color: "var(--bg-deep)" }}
          >
            Rejoindre
          </Link>
        </div>

        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--bg-muted)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Temps réel · WebSocket · Gratuit
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="px-6 pb-16 w-full max-w-2xl mx-auto">
        <p
          className="text-center text-xs font-bold uppercase tracking-widest mb-6"
          style={{ color: "var(--bg-muted)" }}
        >
          Ce qu&apos;on fait
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FeatureCard
            emoji="🎤"
            title="Karaoké"
            description="Paroles synchronisées en temps réel. Chante avec tes amis peu importe où tu es."
            accent="var(--green)"
          />
          <FeatureCard
            emoji="🎵"
            title="Blind Test"
            description="Devine la chanson avant les autres. Parties rapides, classement en direct."
            accent="var(--pink)"
          />
          <FeatureCard
            emoji="🎶"
            title="Playlists collabs"
            description="Chaque invité ajoute ses sons. Construisez la playlist de la soirée ensemble."
            accent="var(--green)"
          />
          <FeatureCard
            emoji="🕹️"
            title="Mini-jeux"
            description="Quiz musical, Name That Tune... Des défis pour rire et se challenger."
            accent="var(--pink)"
          />
        </div>
      </section>

      {/* ── Spotify banner ── */}
      <section className="px-6 pb-16 w-full max-w-2xl mx-auto">
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 border"
          style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
        >
          <span className="text-4xl">🎧</span>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold" style={{ color: "var(--light)" }}>Propulsé par Spotify</p>
            <p className="text-sm mt-1" style={{ color: "var(--bg-muted)" }}>
              Accède à des millions de titres. Connecte ton compte pour une expérience complète.
            </p>
          </div>
          <Link
            href="/connexion"
            className="px-5 py-2.5 rounded-full font-bold text-sm text-white whitespace-nowrap transition-all hover:scale-105"
            style={{ background: "#1DB954" }}
          >
            Connecter Spotify
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="mt-auto border-t px-6 py-6 text-center text-sm font-semibold"
        style={{ borderColor: "var(--bg-card)", color: "var(--bg-muted)" }}
      >
        WeMiix — Faites de chaque soirée une expérience musicale inoubliable 🎉
      </footer>
    </div>
  );
}

/* ── Composants locaux ── */

function WeMiixLogo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <span className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-league-spartan)" }}>
        <span style={{ color: "var(--green)" }}>We</span>
        <span style={{ color: "var(--light)" }}>M</span>
        <span style={{ color: "var(--pink)" }}>ii</span>
        <span style={{ color: "var(--light)" }}>x</span>
      </span>
    </div>
  );
}

function VinylRecord() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full spin-slow" xmlns="http://www.w3.org/2000/svg">
      {/* Disque */}
      <circle cx="50" cy="50" r="48" fill="#162936" stroke="#3b5265" strokeWidth="1" />
      {/* Sillons */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="#3b5265" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#3b5265" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#3b5265" strokeWidth="0.8" />
      {/* Label central */}
      <circle cx="50" cy="50" r="16" fill="#051825" />
      <circle cx="50" cy="50" r="14" fill="none" stroke="#ff2969" strokeWidth="1.5" />
      {/* Trou */}
      <circle cx="50" cy="50" r="3" fill="#3b5265" />
      {/* Reflet */}
      <path d="M 20 30 Q 40 15 60 25" fill="none" stroke="#27e965" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
  accent,
}: {
  emoji: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 border card-hover cursor-pointer"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--bg-muted)",
        borderLeftWidth: "3px",
        borderLeftColor: accent,
      }}
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-bold text-base mb-1" style={{ color: accent }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--bg-muted)" }}>
        {description}
      </p>
    </div>
  );
}

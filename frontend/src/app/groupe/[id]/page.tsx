"use client";

import Link from "next/link";
import { useState } from "react";

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "host" | "guest";
  score: number;
}

// Données mock — en prod elles viendraient du WebSocket/API
const mockMembers: Member[] = [
  { id: "1", name: "Alex", avatar: "🎤", role: "host", score: 1240 },
  { id: "2", name: "Sam", avatar: "🎵", role: "guest", score: 980 },
  { id: "3", name: "Léa", avatar: "🎶", role: "guest", score: 760 },
  { id: "4", name: "Max", avatar: "🎧", role: "guest", score: 440 },
];

export default function GroupePage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false);
  const groupCode = params.id;

  function copyLink() {
    navigator.clipboard?.writeText(
      `${window.location.origin}/groupe/${groupCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      {/* Header groupe */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
            Groupe
          </p>
          <h1 className="text-2xl font-black" style={{ color: "var(--light)" }}>
            #{groupCode}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(39,233,101,0.15)", color: "var(--green)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            En direct
          </span>
          <button
            onClick={copyLink}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors border"
            style={{ borderColor: "var(--bg-muted)", color: copied ? "var(--green)" : "var(--bg-muted)" }}
          >
            {copied ? "✓ Copié" : "📋 Inviter"}
          </button>
        </div>
      </div>

      {/* Membres */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Membres ({mockMembers.length})
        </h2>
        <div className="flex flex-col gap-2">
          {mockMembers.map((m, i) => (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "var(--bg-card)" }}
            >
              <span className="text-2xl w-8 text-center">{m.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "var(--light)" }}>
                  {m.name}
                  {m.role === "host" && (
                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(255,41,105,0.2)", color: "var(--pink)" }}>
                      Hôte
                    </span>
                  )}
                </p>
                <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
                  {m.score} pts
                </p>
              </div>
              <span className="text-sm font-black" style={{ color: i === 0 ? "var(--green)" : "var(--bg-muted)" }}>
                #{i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Raccourcis jeux */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Lancer un jeu
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <GameShortcut
            href={`/groupe/${groupCode}/karaoke`}
            emoji="🎤"
            label="Karaoké"
            accent="var(--green)"
            desc="Chante en temps réel"
          />
          <GameShortcut
            href={`/groupe/${groupCode}/blind-test`}
            emoji="🎵"
            label="Blind Test"
            accent="var(--pink)"
            desc="Devine avant les autres"
          />
          <GameShortcut
            href={`/groupe/${groupCode}/playlist`}
            emoji="🎶"
            label="Playlist"
            accent="var(--green)"
            desc="Construisez-la ensemble"
          />
          <GameShortcut
            href={`/groupe/${groupCode}/mini-jeux`}
            emoji="🕹️"
            label="Mini-jeux"
            accent="var(--pink)"
            desc="Quiz, défis et fun"
          />
        </div>
      </section>
    </main>
  );
}

function GameShortcut({
  href,
  emoji,
  label,
  accent,
  desc,
}: {
  href: string;
  emoji: string;
  label: string;
  accent: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl p-4 border card-hover flex flex-col gap-2"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--bg-muted)",
        borderLeftWidth: "3px",
        borderLeftColor: accent,
      }}
    >
      <span className="text-3xl">{emoji}</span>
      <p className="font-bold text-sm" style={{ color: accent }}>
        {label}
      </p>
      <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
        {desc}
      </p>
    </Link>
  );
}

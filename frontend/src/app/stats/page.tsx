"use client";

import Link from "next/link";
import { useState } from "react";

type StatTab = "personal" | "group";

const personalStats = {
  totalGames: 47,
  karaokeScore: 84,   // %
  blindTestAccuracy: 72, // %
  favoriteArtist: "Daft Punk",
  favoriteGenre: "Électro",
  totalPoints: 12840,
  rank: 3,
  streak: 5,
  records: [
    { label: "Meilleur score blind test", value: "980 pts", emoji: "🎵" },
    { label: "Plus rapide (Name That Tune)", value: "2.3s", emoji: "⚡" },
    { label: "Votes reçus en karaoké", value: "48 votes", emoji: "🏆" },
  ],
  history: [
    { date: "Hier", game: "Blind Test", score: 780, result: "win" },
    { date: "Hier", game: "Karaoké", score: 620, result: "win" },
    { date: "Jeu 12 juin", game: "Quiz Musical", score: 340, result: "loss" },
    { date: "Mar 10 juin", game: "Name That Tune", score: 910, result: "win" },
  ],
};

const groupStats = {
  topPlayers: [
    { name: "Alex", avatar: "🎤", points: 12840, gamesWon: 24 },
    { name: "Sam", avatar: "🎵", points: 10200, gamesWon: 18 },
    { name: "Léa", avatar: "🎶", points: 8700, gamesWon: 14 },
    { name: "Max", avatar: "🎧", points: 5400, gamesWon: 9 },
  ],
  favoriteGenre: "Pop",
  totalSessions: 12,
  bestStreak: "Alex · 7 victoires consécutives",
  records: [
    { label: "Score record du groupe", value: "980 pts (Alex)", emoji: "🥇" },
    { label: "Session la plus longue", value: "3h42", emoji: "⏱️" },
    { label: "Titres ajoutés en playlist", value: "234 titres", emoji: "🎶" },
  ],
};

export default function StatsPage() {
  const [tab, setTab] = useState<StatTab>("personal");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      {/* Header */}
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-sm" style={{ color: "var(--bg-muted)" }}>← Accueil</Link>
        </div>

        <h1 className="text-2xl font-black mb-1" style={{ color: "var(--light)" }}>
          📊 Statistiques
        </h1>

        {/* Tabs */}
        <div className="flex mt-4 rounded-xl overflow-hidden border" style={{ borderColor: "var(--bg-muted)" }}>
          <button
            onClick={() => setTab("personal")}
            className="flex-1 py-2.5 text-sm font-bold transition-colors"
            style={{
              background: tab === "personal" ? "var(--pink)" : "transparent",
              color: tab === "personal" ? "#fff" : "var(--bg-muted)",
            }}
          >
            Mes stats
          </button>
          <button
            onClick={() => setTab("group")}
            className="flex-1 py-2.5 text-sm font-bold transition-colors"
            style={{
              background: tab === "group" ? "var(--pink)" : "transparent",
              color: tab === "group" ? "#fff" : "var(--bg-muted)",
            }}
          >
            Mon groupe
          </button>
        </div>
      </div>

      <div className="px-4 pb-20 max-w-lg mx-auto">
        {tab === "personal" ? (
          <PersonalStats />
        ) : (
          <GroupStats />
        )}
      </div>
    </div>
  );
}

function PersonalStats() {
  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="🎮" label="Parties jouées" value={String(personalStats.totalGames)} accent="var(--green)" />
        <StatCard emoji="🏆" label="Points totaux" value={personalStats.totalPoints.toLocaleString()} accent="var(--pink)" />
        <StatCard emoji="🎵" label="Précision blind test" value={`${personalStats.blindTestAccuracy}%`} accent="var(--green)" />
        <StatCard emoji="🔥" label="Streak actuel" value={`${personalStats.streak} 🔥`} accent="var(--pink)" />
      </div>

      {/* Artiste / Genre favori */}
      <div
        className="rounded-2xl p-4 border"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Profil musical
        </p>
        <div className="flex gap-4">
          <div className="flex-1 text-center">
            <p className="text-2xl mb-1">🎤</p>
            <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Artiste favori</p>
            <p className="font-black text-sm" style={{ color: "var(--light)" }}>{personalStats.favoriteArtist}</p>
          </div>
          <div className="w-px" style={{ background: "var(--bg-muted)" }} />
          <div className="flex-1 text-center">
            <p className="text-2xl mb-1">🎵</p>
            <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Genre favori</p>
            <p className="font-black text-sm" style={{ color: "var(--light)" }}>{personalStats.favoriteGenre}</p>
          </div>
          <div className="w-px" style={{ background: "var(--bg-muted)" }} />
          <div className="flex-1 text-center">
            <p className="text-2xl mb-1">🥉</p>
            <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Classement</p>
            <p className="font-black text-sm" style={{ color: "var(--light)" }}>#{personalStats.rank}</p>
          </div>
        </div>
      </div>

      {/* Records perso */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--bg-muted)" }}>
          Records
        </p>
        <div className="flex flex-col gap-2">
          {personalStats.records.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "var(--bg-card)" }}
            >
              <span className="text-xl">{r.emoji}</span>
              <span className="flex-1 text-sm" style={{ color: "var(--light)" }}>{r.label}</span>
              <span className="font-black text-sm" style={{ color: "var(--green)" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historique */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--bg-muted)" }}>
          Dernières parties
        </p>
        <div className="flex flex-col gap-2">
          {personalStats.history.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "var(--bg-card)" }}
            >
              <span className="text-lg">{h.result === "win" ? "✅" : "❌"}</span>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "var(--light)" }}>{h.game}</p>
                <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{h.date}</p>
              </div>
              <span className="font-black text-sm" style={{ color: h.result === "win" ? "var(--green)" : "var(--pink)" }}>
                {h.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupStats() {
  return (
    <div className="flex flex-col gap-5">
      {/* Classement */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Classement du groupe
        </p>
        {groupStats.topPlayers.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl mb-2 border"
            style={{
              background: i === 0 ? "rgba(39,233,101,0.1)" : "var(--bg-card)",
              borderColor: i === 0 ? "var(--green)" : "var(--bg-muted)",
            }}
          >
            <span className="font-black text-xl w-8 text-center">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
            </span>
            <span className="text-2xl">{p.avatar}</span>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: "var(--light)" }}>{p.name}</p>
              <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{p.gamesWon} victoires</p>
            </div>
            <span className="font-black text-sm" style={{ color: i === 0 ? "var(--green)" : "var(--light)" }}>
              {p.points.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>

      {/* Stats du groupe */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="🎮" label="Sessions jouées" value={String(groupStats.totalSessions)} accent="var(--green)" />
        <StatCard emoji="🎵" label="Genre d'excellence" value={groupStats.favoriteGenre} accent="var(--pink)" />
      </div>

      {/* Records groupe */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--bg-muted)" }}>
          Records du groupe
        </p>
        <div className="flex flex-col gap-2">
          {groupStats.records.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "var(--bg-card)" }}
            >
              <span className="text-xl">{r.emoji}</span>
              <span className="flex-1 text-sm" style={{ color: "var(--light)" }}>{r.label}</span>
              <span className="font-black text-sm" style={{ color: "var(--green)" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best streak */}
      <div
        className="rounded-2xl p-4 border text-center"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        <p className="text-2xl mb-1">🔥</p>
        <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Meilleur streak</p>
        <p className="font-black text-sm mt-1" style={{ color: "var(--light)" }}>{groupStats.bestStreak}</p>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, accent }: { emoji: string; label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-2xl p-4 border flex flex-col gap-1"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--bg-muted)",
        borderTopWidth: "3px",
        borderTopColor: accent,
      }}
    >
      <span className="text-2xl">{emoji}</span>
      <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{label}</p>
      <p className="font-black text-lg" style={{ color: "var(--light)" }}>{value}</p>
    </div>
  );
}

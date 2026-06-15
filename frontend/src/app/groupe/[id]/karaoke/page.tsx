"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { fetchLyrics, getActiveLine, type LyricLine } from "@/lib/lyrics";

interface Singer {
  id: string;
  name: string;
  avatar: string;
  votes: number;
}

const mockSingers: Singer[] = [
  { id: "1", name: "Alex", avatar: "🎤", votes: 12 },
  { id: "2", name: "Sam", avatar: "🎵", votes: 8 },
  { id: "3", name: "Léa", avatar: "🎶", votes: 5 },
];

const mockTrack = {
  artist: "Daft Punk",
  title: "Get Lucky",
  album: "Random Access Memories",
  duration: 248,
};

type KaraokeView = "search" | "singing" | "vote" | "scores";

export default function KaraokePage({ params }: { params: { id: string } }) {
  const [view, setView] = useState<KaraokeView>("search");
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [lyricsError, setLyricsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [myVote, setMyVote] = useState<string | null>(null);
  const [singers, setSingers] = useState<Singer[]>(mockSingers);
  const [scores, setScores] = useState<{ name: string; score: number; avatar: string }[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const activeLine = getActiveLine(lyrics, currentTime);

  // Auto-scroll vers la ligne active
  useEffect(() => {
    if (!lyricsContainerRef.current || activeLine < 0) return;
    const el = lyricsContainerRef.current.querySelector(`[data-line="${activeLine}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeLine]);

  // Simuler la progression du temps (en prod : synchronisé via WebSocket)
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => t + 0.1);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing]);

  const loadLyrics = useCallback(async () => {
    setLoadingLyrics(true);
    setLyricsError("");
    try {
      const lines = await fetchLyrics(mockTrack);
      if (lines.length === 0) {
        setLyricsError("Paroles introuvables pour ce titre.");
      } else {
        setLyrics(lines);
        setView("singing");
        setCurrentTime(0);
      }
    } catch {
      setLyricsError("Erreur lors du chargement des paroles.");
    } finally {
      setLoadingLyrics(false);
    }
  }, []);

  function handleVote(singerId: string) {
    if (myVote) return;
    setMyVote(singerId);
    setSingers((prev) =>
      prev.map((s) => (s.id === singerId ? { ...s, votes: s.votes + 1 } : s))
    );
  }

  function finishSinging() {
    setPlaying(false);
    setView("vote");
  }

  function showFinalScores() {
    const computed = singers
      .map((s) => ({ name: s.name, avatar: s.avatar, score: s.votes * 100 }))
      .sort((a, b) => b.score - a.score);
    setScores(computed);
    setView("scores");
  }

  return (
    <main className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
            Karaoké
          </p>
          <h1 className="text-xl font-black" style={{ color: "var(--light)" }}>
            🎤 Chante !
          </h1>
        </div>
        {view === "singing" && (
          <button
            onClick={finishSinging}
            className="text-xs font-bold px-4 py-2 rounded-full"
            style={{ background: "rgba(255,41,105,0.2)", color: "var(--pink)" }}
          >
            Terminer
          </button>
        )}
      </div>

      {/* Vue : Recherche */}
      {view === "search" && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Artiste — Titre…"
              className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--bg-muted)",
                color: "var(--light)",
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          </div>

          {/* Suggestion rapide */}
          <div className="rounded-2xl p-4 border" style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--bg-muted)" }}>
              Suggestion
            </p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">💿</span>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "var(--light)" }}>{mockTrack.title}</p>
                <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{mockTrack.artist}</p>
              </div>
              <button
                onClick={loadLyrics}
                disabled={loadingLyrics}
                className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{ background: "var(--green)", color: "var(--bg-deep)" }}
              >
                {loadingLyrics ? "⏳" : "Chanter"}
              </button>
            </div>
          </div>

          {lyricsError && (
            <p className="text-xs px-4 py-3 rounded-xl" style={{ background: "rgba(255,41,105,0.15)", color: "var(--pink)" }}>
              {lyricsError}
            </p>
          )}

          <p className="text-xs text-center" style={{ color: "var(--bg-muted)" }}>
            Paroles via LRCLIB · Fallback lyrics.ovh
          </p>
        </div>
      )}

      {/* Vue : Chant */}
      {view === "singing" && (
        <div className="flex flex-col gap-4">
          {/* Contrôles */}
          <div
            className="rounded-2xl p-4 flex items-center gap-4 border"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
          >
            <span className="text-2xl">💿</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: "var(--light)" }}>{mockTrack.title}</p>
              <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{mockTrack.artist}</p>
            </div>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all hover:scale-110"
              style={{ background: "var(--pink)", color: "#fff" }}
            >
              {playing ? "⏸" : "▶"}
            </button>
          </div>

          {/* Paroles synchronisées */}
          <div
            ref={lyricsContainerRef}
            className="rounded-2xl border overflow-y-auto"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--bg-muted)",
              height: "55vh",
            }}
          >
            <div className="p-6 flex flex-col gap-3">
              {lyrics.map((line, i) => (
                <p
                  key={i}
                  data-line={i}
                  className="text-center text-base font-bold transition-all duration-300"
                  style={{
                    color:
                      i === activeLine
                        ? "var(--green)"
                        : i < activeLine
                        ? "var(--bg-muted)"
                        : "var(--light)",
                    fontSize: i === activeLine ? "1.2rem" : "1rem",
                    opacity: Math.abs(i - activeLine) > 3 ? 0.3 : 1,
                  }}
                >
                  {line.text || "♪"}
                </p>
              ))}
            </div>
          </div>

          {/* Progression */}
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--bg-muted)" }}>
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: "var(--green)",
                  width: `${Math.min((currentTime / (mockTrack.duration || 240)) * 100, 100)}%`,
                }}
              />
            </div>
            <span>{formatTime(mockTrack.duration ?? 240)}</span>
          </div>
        </div>
      )}

      {/* Vue : Vote */}
      {view === "vote" && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="text-2xl mb-1">🏆</p>
            <p className="font-black text-lg" style={{ color: "var(--light)" }}>
              Vote pour le meilleur chanteur !
            </p>
            <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
              {myVote ? "Vote enregistré ✓" : "Un seul vote par manche"}
            </p>
          </div>

          {singers.map((singer) => (
            <button
              key={singer.id}
              onClick={() => handleVote(singer.id)}
              disabled={!!myVote}
              className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] disabled:cursor-not-allowed"
              style={{
                background: myVote === singer.id ? "rgba(39,233,101,0.15)" : "var(--bg-card)",
                borderColor: myVote === singer.id ? "var(--green)" : "var(--bg-muted)",
                borderWidth: myVote === singer.id ? "2px" : "1px",
              }}
            >
              <span className="text-3xl">{singer.avatar}</span>
              <div className="flex-1 text-left">
                <p className="font-bold" style={{ color: "var(--light)" }}>{singer.name}</p>
                <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
                  {singer.votes} vote{singer.votes > 1 ? "s" : ""}
                </p>
              </div>
              {myVote === singer.id && (
                <span className="font-bold" style={{ color: "var(--green)" }}>✓</span>
              )}
            </button>
          ))}

          {myVote && (
            <button
              onClick={showFinalScores}
              className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 mt-2 glow-pink"
              style={{ background: "var(--pink)" }}
            >
              Voir les scores 🏆
            </button>
          )}
        </div>
      )}

      {/* Vue : Scores */}
      {view === "scores" && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="text-4xl mb-1">🏆</p>
            <p className="font-black text-xl" style={{ color: "var(--light)" }}>Classement</p>
          </div>

          {scores.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border"
              style={{
                background: i === 0 ? "rgba(39,233,101,0.1)" : "var(--bg-card)",
                borderColor: i === 0 ? "var(--green)" : "var(--bg-muted)",
              }}
            >
              <span className="text-2xl w-8 text-center font-black" style={{ color: i === 0 ? "var(--green)" : "var(--bg-muted)" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <span className="text-2xl">{s.avatar}</span>
              <div className="flex-1">
                <p className="font-bold" style={{ color: "var(--light)" }}>{s.name}</p>
              </div>
              <p className="font-black" style={{ color: i === 0 ? "var(--green)" : "var(--light)" }}>
                {s.score} pts
              </p>
            </div>
          ))}

          <button
            onClick={() => { setView("search"); setLyrics([]); setCurrentTime(0); setMyVote(null); }}
            className="w-full py-3.5 rounded-full font-bold text-sm border transition-all hover:scale-105 mt-2"
            style={{ borderColor: "var(--bg-muted)", color: "var(--light)" }}
          >
            Nouvelle chanson
          </button>
        </div>
      )}
    </main>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

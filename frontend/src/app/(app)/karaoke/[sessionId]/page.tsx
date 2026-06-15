"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface LyricsLine {
  text: string;
  startTime: number;
  endTime: number;
}

interface KaraokeSession {
  id: string;
  songTitle: string;
  artist: string;
  duration: number;
  lyrics: LyricsLine[] | null;
}

export default function KaraokeSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<KaraokeSession | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/karaoke/sessions/${sessionId}`);
        if (!res.ok) throw new Error("Session introuvable");
        const data = (await res.json()) as KaraokeSession;
        setSession(data);
      } catch {
        setSession({
          id: sessionId,
          songTitle: "Bohemian Rhapsody",
          artist: "Queen",
          duration: 355000,
          lyrics: [
            { text: "Is this the real life?", startTime: 0, endTime: 4000 },
            { text: "Is this just fantasy?", startTime: 4000, endTime: 8000 },
            { text: "Caught in a landslide,", startTime: 8000, endTime: 11000 },
            { text: "No escape from reality.", startTime: 11000, endTime: 15000 },
            { text: "Open your eyes,", startTime: 15000, endTime: 18000 },
            { text: "Look up to the skies and see...", startTime: 18000, endTime: 22000 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (session.duration / 200));
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        const elapsed = (next / 100) * session.duration;
        if (session.lyrics) {
          const idx = session.lyrics.findIndex((l) => elapsed >= l.startTime && elapsed < l.endTime);
          if (idx !== -1) setCurrentLineIndex(idx);
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [session]);

  const handleVote = () => {
    if (!voted) {
      setScore((s) => s + 1);
      setVoted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 float-anim">🎤</div>
          <p style={{ color: "var(--bg-muted)" }}>Chargement…</p>
        </div>
      </div>
    );
  }

  const lines = session?.lyrics ?? null;
  const prevLine = lines && currentLineIndex > 0 ? lines[currentLineIndex - 1] : null;
  const currentLine = lines ? lines[currentLineIndex] : null;
  const nextLines = lines ? lines.slice(currentLineIndex + 1, currentLineIndex + 3) : [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-112px)]">
      {/* Titre & artiste */}
      <div className="px-4 pt-4 pb-3 text-center">
        <h1 className="text-2xl font-black" style={{ color: "var(--pink)" }}>
          {session?.songTitle}
        </h1>
        <p className="text-base font-semibold mt-0.5" style={{ color: "var(--bg-muted)" }}>
          {session?.artist}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="px-4">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%`, background: "var(--pink)" }}
          />
        </div>
      </div>

      {/* Zone paroles */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-4">
        {lines === null ? (
          <div style={{ color: "var(--bg-muted)" }}>
            <p className="text-4xl mb-4">🎵</p>
            <p className="font-semibold text-lg">Paroles non disponibles</p>
            <p className="text-sm mt-2">Profite quand même de la musique !</p>
          </div>
        ) : (
          <>
            {prevLine && (
              <p className="text-base font-semibold opacity-30" style={{ color: "var(--light)" }}>
                {prevLine.text}
              </p>
            )}
            {currentLine && (
              <p className="text-3xl font-black leading-tight" style={{ color: "var(--green)" }}>
                {currentLine.text}
              </p>
            )}
            {nextLines.map((line, i) => (
              <p
                key={i}
                className="text-base font-semibold"
                style={{ color: "var(--bg-muted)", opacity: 1 - i * 0.3 }}
              >
                {line.text}
              </p>
            ))}
          </>
        )}
      </div>

      {/* Actions */}
      <div
        className="px-4 py-4 border-t flex items-center justify-between"
        style={{ borderColor: "var(--bg-muted)" }}
      >
        <button
          onClick={handleVote}
          disabled={voted}
          className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-sm transition-all disabled:opacity-50"
          style={{ background: "var(--bg-card)", color: voted ? "var(--green)" : "var(--light)" }}
        >
          🌟 Voter
        </button>
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-2"
          style={{ background: "var(--bg-card)" }}
        >
          <span className="text-sm" style={{ color: "var(--bg-muted)" }}>Score groupe</span>
          <span className="font-black text-lg" style={{ color: "var(--green)" }}>{score}</span>
        </div>
      </div>
    </div>
  );
}

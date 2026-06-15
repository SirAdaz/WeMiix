"use client";

import { useEffect, useRef, useState } from "react";

type Genre = "all" | "rap" | "pop" | "rock" | "electro" | "rnb" | "variete";
type Difficulty = "easy" | "normal" | "hard";
type BlindTestView = "config" | "playing" | "reveal" | "scores";

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  answered: boolean;
  correct: boolean;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  year: number;
  previewUrl?: string;
}

const mockTracks: Track[] = [
  { id: "1", title: "SICKO MODE", artist: "Travis Scott", genre: "rap", year: 2018 },
  { id: "2", title: "Shape of You", artist: "Ed Sheeran", genre: "pop", year: 2017 },
  { id: "3", title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "rock", year: 1991 },
  { id: "4", title: "One More Time", artist: "Daft Punk", genre: "electro", year: 2000 },
  { id: "5", title: "Alright", artist: "Kendrick Lamar", genre: "rap", year: 2015 },
];

const mockPlayers: Player[] = [
  { id: "1", name: "Alex", avatar: "🎤", score: 0, answered: false, correct: false },
  { id: "2", name: "Sam", avatar: "🎵", score: 0, answered: false, correct: false },
  { id: "3", name: "Léa", avatar: "🎶", score: 0, answered: false, correct: false },
];

const GENRES: { value: Genre; label: string }[] = [
  { value: "all", label: "🎵 Tous" },
  { value: "rap", label: "🎤 Rap" },
  { value: "pop", label: "💫 Pop" },
  { value: "rock", label: "🎸 Rock" },
  { value: "electro", label: "⚡ Électro" },
  { value: "rnb", label: "🎶 R&B" },
  { value: "variete", label: "🎭 Variété" },
];

const TIMER_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 30,
  normal: 20,
  hard: 10,
};

export default function BlindTestPage({ params }: { params: { id: string } }) {
  const [view, setView] = useState<BlindTestView>("config");
  const [genre, setGenre] = useState<Genre>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [yearFrom, setYearFrom] = useState(2000);
  const [yearTo, setYearTo] = useState(2024);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [timer, setTimer] = useState(20);
  const [answer, setAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [round, setRound] = useState(1);
  const totalRounds = 5;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTracks = mockTracks.filter(
    (t) =>
      (genre === "all" || t.genre === genre) &&
      t.year >= yearFrom &&
      t.year <= yearTo
  );
  const currentTrack = filteredTracks[currentTrackIdx % filteredTracks.length] ?? mockTracks[0];

  useEffect(() => {
    if (view !== "playing") return;
    const maxTime = TIMER_BY_DIFFICULTY[difficulty];
    setTimer(maxTime);

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setView("reveal");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [view, difficulty, currentTrackIdx]);

  function startGame() {
    setCurrentTrackIdx(0);
    setRound(1);
    setPlayers(mockPlayers.map((p) => ({ ...p, score: 0 })));
    setView("playing");
  }

  function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || hasAnswered) return;

    const isCorrect =
      answer.toLowerCase().includes(currentTrack.title.toLowerCase()) ||
      answer.toLowerCase().includes(currentTrack.artist.toLowerCase());

    const elapsed = TIMER_BY_DIFFICULTY[difficulty] - timer;
    const points = isCorrect ? Math.max(10, 100 - elapsed * 3) : 0;

    setHasAnswered(true);
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === 0 ? { ...p, score: p.score + points, answered: true, correct: isCorrect } : p
      )
    );
    clearInterval(timerRef.current!);
    setTimeout(() => setView("reveal"), 500);
  }

  function nextRound() {
    if (round >= totalRounds) {
      setView("scores");
      return;
    }
    setRound((r) => r + 1);
    setCurrentTrackIdx((i) => i + 1);
    setAnswer("");
    setHasAnswered(false);
    setView("playing");
  }

  const maxTime = TIMER_BY_DIFFICULTY[difficulty];
  const timerPct = (timer / maxTime) * 100;

  return (
    <main className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
            Blind Test
          </p>
          <h1 className="text-xl font-black" style={{ color: "var(--light)" }}>
            🎵 Devine !
          </h1>
        </div>
        {view === "playing" && (
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Manche</p>
            <p className="font-black" style={{ color: "var(--light)" }}>{round}/{totalRounds}</p>
          </div>
        )}
      </div>

      {/* Config */}
      {view === "config" && (
        <div className="flex flex-col gap-5">
          {/* Genres */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--bg-muted)" }}>
              Genre
            </p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGenre(g.value)}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
                  style={{
                    background: genre === g.value ? "var(--pink)" : "transparent",
                    borderColor: genre === g.value ? "var(--pink)" : "var(--bg-muted)",
                    color: genre === g.value ? "#fff" : "var(--bg-muted)",
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Années */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--bg-muted)" }}>
              Période : {yearFrom} — {yearTo}
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs" style={{ color: "var(--bg-muted)" }}>De</label>
                <input
                  type="range"
                  min={1960}
                  max={2023}
                  value={yearFrom}
                  onChange={(e) => setYearFrom(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs" style={{ color: "var(--bg-muted)" }}>À</label>
                <input
                  type="range"
                  min={1960}
                  max={2024}
                  value={yearTo}
                  onChange={(e) => setYearTo(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--bg-muted)" }}>
              Difficulté
            </p>
            <div className="flex gap-2">
              {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
                  style={{
                    background: difficulty === d ? "var(--green)" : "transparent",
                    borderColor: difficulty === d ? "var(--green)" : "var(--bg-muted)",
                    color: difficulty === d ? "var(--bg-deep)" : "var(--bg-muted)",
                  }}
                >
                  {d === "easy" ? "😊 Facile" : d === "normal" ? "😤 Normal" : "🔥 Difficile"}
                </button>
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--bg-muted)" }}>
              {TIMER_BY_DIFFICULTY[difficulty]}s par manche · Plus vite = plus de points
            </p>
          </div>

          <button
            onClick={startGame}
            disabled={filteredTracks.length === 0}
            className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 mt-2 glow-pink disabled:opacity-50"
            style={{ background: "var(--pink)" }}
          >
            Lancer le blind test 🚀
          </button>
        </div>
      )}

      {/* Playing */}
      {view === "playing" && (
        <div className="flex flex-col gap-5">
          {/* Timer */}
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--bg-muted)" }}>
              <span>Temps restant</span>
              <span
                className="font-black"
                style={{ color: timer <= 5 ? "var(--pink)" : "var(--green)" }}
              >
                {timer}s
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${timerPct}%`,
                  background: timerPct > 40 ? "var(--green)" : timerPct > 20 ? "#f59e0b" : "var(--pink)",
                }}
              />
            </div>
          </div>

          {/* Lecteur audio fake (en prod : Spotify Web Playback SDK) */}
          <div
            className="rounded-2xl p-6 border flex flex-col items-center gap-4"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--bg-deep)" }}>
              <span className="text-4xl">🎧</span>
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: "var(--bg-muted)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Écoute…
            </div>
            {/* Barre de son animée */}
            <div className="flex items-end gap-1 h-8">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{
                    background: "var(--green)",
                    height: `${Math.random() * 100}%`,
                    animation: `grow ${0.3 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Saisie de réponse */}
          <form onSubmit={submitAnswer} className="flex flex-col gap-3">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={hasAnswered}
              placeholder="Titre ou artiste…"
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border text-center font-bold"
              style={{
                background: "var(--bg-card)",
                borderColor: hasAnswered ? "var(--green)" : "var(--bg-muted)",
                color: "var(--light)",
              }}
            />
            <button
              type="submit"
              disabled={hasAnswered}
              className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 glow-pink disabled:opacity-50"
              style={{ background: "var(--pink)" }}
            >
              {hasAnswered ? "✓ Réponse envoyée" : "Valider 🚀"}
            </button>
          </form>

          {/* Autres joueurs */}
          <div className="flex gap-2">
            {players.map((p) => (
              <div key={p.id} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xl">{p.avatar}</span>
                <span className="text-[10px] font-semibold" style={{ color: p.answered ? "var(--green)" : "var(--bg-muted)" }}>
                  {p.answered ? "✓" : "…"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reveal */}
      {view === "reveal" && (
        <div className="flex flex-col gap-5 items-center text-center">
          <div className="text-5xl">{players[0].correct ? "🎉" : "😅"}</div>
          <div>
            <p className="text-xl font-black" style={{ color: "var(--light)" }}>{currentTrack.title}</p>
            <p className="text-base" style={{ color: "var(--bg-muted)" }}>{currentTrack.artist} · {currentTrack.year}</p>
          </div>
          <div className="w-full flex flex-col gap-2">
            {players
              .sort((a, b) => b.score - a.score)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "var(--bg-card)" }}
                >
                  <span className="text-xl">{p.avatar}</span>
                  <span className="flex-1 text-left font-bold text-sm" style={{ color: "var(--light)" }}>{p.name}</span>
                  <span className="font-black text-sm" style={{ color: "var(--green)" }}>{p.score} pts</span>
                </div>
              ))}
          </div>
          <button
            onClick={nextRound}
            className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 glow-pink"
            style={{ background: "var(--pink)" }}
          >
            {round >= totalRounds ? "Voir les scores finaux 🏆" : "Manche suivante →"}
          </button>
        </div>
      )}

      {/* Scores finaux */}
      {view === "scores" && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="text-4xl mb-1">🏆</p>
            <p className="font-black text-xl" style={{ color: "var(--light)" }}>Scores finaux</p>
          </div>
          {[...players]
            .sort((a, b) => b.score - a.score)
            .map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4 rounded-2xl border"
                style={{
                  background: i === 0 ? "rgba(39,233,101,0.1)" : "var(--bg-card)",
                  borderColor: i === 0 ? "var(--green)" : "var(--bg-muted)",
                }}
              >
                <span className="font-black text-xl w-8 text-center">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </span>
                <span className="text-2xl">{p.avatar}</span>
                <span className="flex-1 font-bold" style={{ color: "var(--light)" }}>{p.name}</span>
                <span className="font-black" style={{ color: i === 0 ? "var(--green)" : "var(--light)" }}>
                  {p.score} pts
                </span>
              </div>
            ))}
          <button
            onClick={() => { setView("config"); setRound(1); }}
            className="w-full py-3.5 rounded-full font-bold text-sm border transition-all hover:scale-105 mt-2"
            style={{ borderColor: "var(--bg-muted)", color: "var(--light)" }}
          >
            Nouvelle partie
          </button>
        </div>
      )}
    </main>
  );
}

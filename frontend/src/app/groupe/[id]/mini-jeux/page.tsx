"use client";

import { use, useEffect, useRef, useState } from "react";

type GameId = "name-that-tune" | "quiz" | "lobby";
type Difficulty = "easy" | "normal" | "hard";
type Theme = "80s" | "rap" | "pop" | "rock" | "all";

/* ─── Types partagés ─── */
interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isReady: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correct: number;
  theme: Theme;
}

/* ─── Données mock ─── */
const mockPlayers: Player[] = [
  { id: "1", name: "Alex", avatar: "🎤", score: 0, isReady: true },
  { id: "2", name: "Sam", avatar: "🎵", score: 0, isReady: false },
  { id: "3", name: "Léa", avatar: "🎶", score: 0, isReady: false },
];

const mockQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "Quel groupe a sorti l'album 'Random Access Memories' (2013) ?",
    choices: ["Justice", "Daft Punk", "Kavinsky", "Gesaffelstein"],
    correct: 1,
    theme: "pop",
  },
  {
    id: "2",
    question: "Quelle année est sorti 'Thriller' de Michael Jackson ?",
    choices: ["1980", "1982", "1984", "1985"],
    correct: 1,
    theme: "80s",
  },
  {
    id: "3",
    question: "Combien d'albums studio a sorti Kendrick Lamar avant 'Mr. Morale' ?",
    choices: ["3", "4", "5", "6"],
    correct: 1,
    theme: "rap",
  },
];

const COUNTDOWN_START = 3;

export default function MiniJeuxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: _groupId } = use(params);
  const [view, setView] = useState<GameId | "lobby" | "scores">("lobby");

  return (
    <main className="px-4 pt-6 max-w-lg mx-auto">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
          Mini-jeux
        </p>
        <h1 className="text-xl font-black" style={{ color: "var(--light)" }}>
          🕹️ C&apos;est l&apos;heure de jouer !
        </h1>
      </div>

      {view === "lobby" && <GameLobby onSelect={setView as (g: GameId | "lobby" | "scores") => void} />}
      {view === "name-that-tune" && <NameThatTune onBack={() => setView("lobby")} />}
      {view === "quiz" && <MusicQuiz onBack={() => setView("lobby")} />}
    </main>
  );
}

/* ─── Lobby ─── */
function GameLobby({ onSelect }: { onSelect: (g: GameId | "lobby" | "scores") => void }) {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  function toggleReady() {
    setPlayers((prev) =>
      prev.map((p, i) => (i === 0 ? { ...p, isReady: !p.isReady } : p))
    );
  }

  function launchGame(game: GameId) {
    setSelectedGame(game);
    setCountdown(COUNTDOWN_START);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (selectedGame) onSelect(selectedGame);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown, selectedGame, onSelect]);

  if (countdown !== null && countdown > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm font-semibold" style={{ color: "var(--bg-muted)" }}>Prêts ?</p>
        <p className="text-8xl font-black" style={{ color: "var(--pink)" }}>{countdown}</p>
      </div>
    );
  }

  const allReady = players.every((p) => p.isReady);

  return (
    <div className="flex flex-col gap-5">
      {/* Joueurs */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
          Joueurs
        </p>
        {players.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "var(--bg-card)" }}
          >
            <span className="text-xl">{p.avatar}</span>
            <span className="flex-1 font-bold text-sm" style={{ color: "var(--light)" }}>{p.name}</span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: p.isReady ? "rgba(39,233,101,0.2)" : "rgba(59,82,101,0.4)",
                color: p.isReady ? "var(--green)" : "var(--bg-muted)",
              }}
            >
              {p.isReady ? "✓ Prêt" : "Attente…"}
            </span>
          </div>
        ))}
        <button
          onClick={toggleReady}
          className="text-sm font-bold py-2.5 rounded-xl border transition-all"
          style={{ borderColor: "var(--bg-muted)", color: "var(--light)" }}
        >
          {players[0].isReady ? "Je ne suis plus prêt" : "Je suis prêt !"}
        </button>
      </div>

      {/* Sélection du jeu */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Choisir un jeu
        </p>
        <div className="flex flex-col gap-3">
          <GameCard
            emoji="🎵"
            title="Name That Tune"
            description="Devine le titre le plus vite possible dès les premières notes"
            accent="var(--pink)"
            disabled={!allReady}
            onPlay={() => launchGame("name-that-tune")}
          />
          <GameCard
            emoji="❓"
            title="Quiz Musical"
            description="Questions sur la musique, les artistes et les albums"
            accent="var(--green)"
            disabled={!allReady}
            onPlay={() => launchGame("quiz")}
          />
          <GameCard
            emoji="💃"
            title="Chorégraphie"
            description="Style Just Dance avec vos musiques perso — Bientôt disponible"
            accent="var(--bg-muted)"
            disabled
            onPlay={() => {}}
            soon
          />
        </div>
      </div>

      {!allReady && (
        <p className="text-xs text-center" style={{ color: "var(--bg-muted)" }}>
          Attends que tout le monde soit prêt pour lancer une partie
        </p>
      )}
    </div>
  );
}

function GameCard({
  emoji, title, description, accent, disabled, onPlay, soon,
}: {
  emoji: string;
  title: string;
  description: string;
  accent: string;
  disabled: boolean;
  onPlay: () => void;
  soon?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl border"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--bg-muted)",
        borderLeftWidth: "3px",
        borderLeftColor: accent,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span className="text-3xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: accent }}>{title}</p>
        <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{description}</p>
      </div>
      {soon ? (
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(59,82,101,0.4)", color: "var(--bg-muted)" }}>
          Bientôt
        </span>
      ) : (
        <button
          onClick={onPlay}
          disabled={disabled}
          className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105 disabled:cursor-not-allowed"
          style={{ background: accent, color: accent === "var(--green)" ? "var(--bg-deep)" : "#fff" }}
        >
          Jouer
        </button>
      )}
    </div>
  );
}

/* ─── Name That Tune ─── */
const MOCK_TUNES = [
  { title: "Lose Yourself", artist: "Eminem", hint: "Film 8 Mile (2002)" },
  { title: "Bohemian Rhapsody", artist: "Queen", hint: "Album A Night at the Opera (1975)" },
  { title: "One Dance", artist: "Drake", hint: "Album Views (2016)" },
];

function NameThatTune({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timer, setTimer] = useState(15);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = MOCK_TUNES[round];

  useEffect(() => {
    if (revealed || finished) return;
    setTimer(15);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setRevealed(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [round, revealed, finished]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    clearInterval(timerRef.current!);
    const correct =
      answer.toLowerCase().includes(current.title.toLowerCase()) ||
      answer.toLowerCase().includes(current.artist.toLowerCase());
    if (correct) setScore((s) => s + Math.max(10, timer * 10));
    setRevealed(true);
  }

  function next() {
    if (round + 1 >= MOCK_TUNES.length) {
      setFinished(true);
    } else {
      setRound((r) => r + 1);
      setAnswer("");
      setRevealed(false);
    }
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-5 py-6">
        <p className="text-4xl">🏆</p>
        <p className="text-xl font-black" style={{ color: "var(--light)" }}>Score final : {score} pts</p>
        <button onClick={onBack} className="w-full py-3.5 rounded-full font-bold text-white glow-pink" style={{ background: "var(--pink)" }}>
          Retour aux jeux
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm" style={{ color: "var(--bg-muted)" }}>← Quitter</button>
        <span className="font-bold text-sm" style={{ color: "var(--light)" }}>Manche {round + 1}/{MOCK_TUNES.length}</span>
        <span className="font-black" style={{ color: "var(--green)" }}>{score} pts</span>
      </div>

      {/* Lecteur */}
      <div className="rounded-2xl p-6 border flex flex-col items-center gap-3" style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--bg-deep)" }}>
          <span className="text-3xl">🎵</span>
        </div>
        <div className="flex items-end gap-1 h-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="w-1.5 rounded-full" style={{ background: "var(--pink)", height: `${40 + Math.random() * 60}%` }} />
          ))}
        </div>
        {revealed && (
          <div className="text-center mt-2">
            <p className="font-black" style={{ color: "var(--green)" }}>{current.title}</p>
            <p className="text-sm" style={{ color: "var(--bg-muted)" }}>{current.artist}</p>
            <p className="text-xs mt-1" style={{ color: "var(--bg-muted)" }}>{current.hint}</p>
          </div>
        )}
      </div>

      {/* Timer */}
      <div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(timer / 15) * 100}%`, background: timer > 8 ? "var(--green)" : timer > 4 ? "#f59e0b" : "var(--pink)" }} />
        </div>
      </div>

      {!revealed ? (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Titre ou artiste…"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-sm outline-none border text-center font-bold"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)", color: "var(--light)" }}
          />
          <button type="submit" className="w-full py-3.5 rounded-full font-bold text-white glow-pink" style={{ background: "var(--pink)" }}>
            Valider
          </button>
        </form>
      ) : (
        <button onClick={next} className="w-full py-3.5 rounded-full font-bold text-white glow-pink" style={{ background: "var(--pink)" }}>
          {round + 1 >= MOCK_TUNES.length ? "Voir mon score" : "Suivant →"}
        </button>
      )}
    </div>
  );
}

/* ─── Quiz Musical ─── */
function MusicQuiz({ onBack }: { onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [theme, setTheme] = useState<Theme>("all");

  const questions = mockQuestions.filter((q) => theme === "all" || q.theme === theme);
  const current = questions[qIdx];

  useEffect(() => {
    if (selected !== null || finished || !current) return;
    setTimer(20);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setSelected(-1); // timeout = no answer
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [qIdx, selected, finished, current]);

  function answer(idx: number) {
    if (selected !== null) return;
    clearInterval(timerRef.current!);
    setSelected(idx);
    if (idx === current.correct) setScore((s) => s + Math.max(10, timer * 5));
  }

  function next() {
    if (qIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
    }
  }

  if (finished || !current) {
    return (
      <div className="flex flex-col items-center gap-5 py-6">
        <p className="text-4xl">🏆</p>
        <p className="text-xl font-black" style={{ color: "var(--light)" }}>Score : {score} pts</p>
        <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
          {score >= questions.length * 40 ? "Excellent ! 🎉" : score >= questions.length * 20 ? "Bien joué 👍" : "Continue de t'entraîner 💪"}
        </p>
        <button onClick={onBack} className="w-full py-3.5 rounded-full font-bold text-white glow-pink" style={{ background: "var(--pink)" }}>
          Retour aux jeux
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm" style={{ color: "var(--bg-muted)" }}>← Quitter</button>
        <span className="font-bold text-sm" style={{ color: "var(--light)" }}>Q{qIdx + 1}/{questions.length}</span>
        <span className="font-black" style={{ color: "var(--green)" }}>{score} pts</span>
      </div>

      {/* Timer */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${(timer / 20) * 100}%`, background: timer > 10 ? "var(--green)" : timer > 5 ? "#f59e0b" : "var(--pink)" }} />
      </div>

      {/* Question */}
      <div className="rounded-2xl p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}>
        <p className="font-bold text-base leading-snug" style={{ color: "var(--light)" }}>
          {current.question}
        </p>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-2">
        {current.choices.map((choice, i) => {
          let bg = "var(--bg-card)";
          let border = "var(--bg-muted)";
          let color = "var(--light)";

          if (selected !== null) {
            if (i === current.correct) { bg = "rgba(39,233,101,0.15)"; border = "var(--green)"; color = "var(--green)"; }
            else if (i === selected && i !== current.correct) { bg = "rgba(255,41,105,0.15)"; border = "var(--pink)"; color = "var(--pink)"; }
          }

          return (
            <button
              key={i}
              onClick={() => answer(i)}
              disabled={selected !== null}
              className="w-full text-left px-4 py-3.5 rounded-xl border font-semibold text-sm transition-all hover:scale-[1.01] disabled:cursor-default"
              style={{ background: bg, borderColor: border, color }}
            >
              <span className="font-black mr-2" style={{ color: "var(--bg-muted)" }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {choice}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button onClick={next} className="w-full py-3.5 rounded-full font-bold text-white glow-pink" style={{ background: "var(--pink)" }}>
          {qIdx + 1 >= questions.length ? "Voir le score" : "Question suivante →"}
        </button>
      )}
    </div>
  );
}

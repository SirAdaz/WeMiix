"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface Player {
  id: string;
  name: string;
  score: number;
}

type AnswerStatus = "idle" | "correct" | "wrong";

export default function BlindTestGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [timeLeft, setTimeLeft] = useState(30);
  const [answer, setAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("idle");
  const [round, setRound] = useState(1);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Toi", score: 0 },
    { id: "2", name: "Alex", score: 150 },
    { id: "3", name: "Marie", score: 100 },
    { id: "4", name: "Lucas", score: 50 },
  ]);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const handleValidate = useCallback(() => {
    if (!answer.trim() || answerStatus !== "idle") return;
    const correct = answer.toLowerCase().includes("bohemian") || answer.toLowerCase().includes("queen");
    setAnswerStatus(correct ? "correct" : "wrong");
    if (correct) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === "1" ? { ...p, score: p.score + Math.max(10, timeLeft * 5) } : p))
      );
    }
  }, [answer, answerStatus, timeLeft]);

  useEffect(() => {
    if (answerStatus !== "idle") return;
    if (timeLeft <= 0) {
      setAnswerStatus("wrong");
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, answerStatus]);

  const handleNextRound = () => {
    setRound((r) => r + 1);
    setTimeLeft(30);
    setAnswer("");
    setAnswerStatus("idle");
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / 30);
  const timerColor = timeLeft > 15 ? "var(--green)" : timeLeft > 7 ? "#ffb800" : "var(--pink)";

  return (
    <div className="flex flex-col min-h-[calc(100vh-112px)] px-4 py-4 max-w-lg mx-auto gap-4">
      {/* En-tête : round + timer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
            Round {round}
          </p>
          <p className="text-sm font-semibold text-light">Blind Test #{gameId}</p>
        </div>

        {/* Timer circulaire */}
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--bg-card)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black" style={{ color: timerColor }}>{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Extrait musical (placeholder) */}
      <div
        className="rounded-2xl p-6 border flex flex-col items-center gap-3 text-center"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        <div className="text-5xl float-anim">🎧</div>
        <p className="font-semibold text-light">Extrait en cours de lecture...</p>
        <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
          Connecte Spotify pour écouter l&apos;extrait
        </p>
        <div className="w-full h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "var(--bg-muted)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${((30 - timeLeft) / 30) * 100}%`, background: "var(--pink)", transition: "width 1s linear" }}
          />
        </div>
      </div>

      {/* Zone réponse */}
      {answerStatus === "idle" ? (
        <div className="flex gap-2">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ta réponse..."
            onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            className="flex-1"
          />
          <Button variant="primary" onClick={handleValidate} disabled={!answer.trim()}>
            Valider
          </Button>
        </div>
      ) : (
        <div
          className="rounded-2xl p-4 flex items-center justify-between border"
          style={{
            background: answerStatus === "correct" ? "rgba(39,233,101,0.15)" : "rgba(255,41,105,0.15)",
            borderColor: answerStatus === "correct" ? "var(--green)" : "var(--pink)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{answerStatus === "correct" ? "✅" : "❌"}</span>
            <div>
              <p className="font-bold" style={{ color: answerStatus === "correct" ? "var(--green)" : "var(--pink)" }}>
                {answerStatus === "correct" ? "Bonne réponse !" : "Pas tout à fait..."}
              </p>
              <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
                La réponse était : Bohemian Rhapsody – Queen
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNextRound}>
            Suite →
          </Button>
        </div>
      )}

      {/* Classement */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Classement
        </p>
        <div className="flex flex-col gap-2">
          {sortedPlayers.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 border"
              style={{
                background: "var(--bg-card)",
                borderColor: idx === 0 ? "var(--green)" : "var(--bg-muted)",
              }}
            >
              <span className="text-base font-black w-6 text-center" style={{ color: "var(--bg-muted)" }}>
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`}
              </span>
              <span className="flex-1 font-semibold text-sm text-light">{player.name}</span>
              <span className="font-black text-base" style={{ color: idx === 0 ? "var(--green)" : "var(--light)" }}>
                {player.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

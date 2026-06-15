"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type BlindTestMode = "random" | "genre" | "year" | "custom";

const GENRES = ["Rap", "Pop", "Rock", "R&B", "Électro", "Années 80", "Années 90", "Années 2000"] as const;
type Genre = (typeof GENRES)[number];

export default function BlindTestPage() {
  const router = useRouter();
  const [mode, setMode] = useState<BlindTestMode>("random");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [year, setYear] = useState("");

  const handleLaunch = () => {
    const gameId = Math.random().toString(36).slice(2, 8).toUpperCase();
    router.push(`/blindtest/${gameId}`);
  };

  const tabs: { key: BlindTestMode; label: string }[] = [
    { key: "random", label: "Aléatoire" },
    { key: "genre", label: "Par genre" },
    { key: "year", label: "Par année" },
    { key: "custom", label: "Personnalisé" },
  ];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-light">Blind Test 🎵</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--bg-muted)" }}>
          Devine la chanson avant les autres !
        </p>
      </div>

      {/* Tabs mode */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Mode de jeu
        </p>
        <div className="flex gap-2 flex-wrap">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: mode === key ? "var(--pink)" : "var(--bg-card)",
                color: mode === key ? "white" : "var(--bg-muted)",
                border: `1px solid ${mode === key ? "transparent" : "var(--bg-muted)"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sélecteur genre */}
      {mode === "genre" && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
            Choisis un genre
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: selectedGenre === g ? "var(--green)" : "var(--bg-card)",
                  color: selectedGenre === g ? "var(--bg-deep)" : "var(--light)",
                  border: `1px solid ${selectedGenre === g ? "transparent" : "var(--bg-muted)"}`,
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sélecteur année */}
      {mode === "year" && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
            Année de sortie
          </p>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Ex: 1990"
          />
        </div>
      )}

      {/* Mode personnalisé */}
      {mode === "custom" && (
        <div
          className="rounded-2xl p-5 border text-center"
          style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
        >
          <p className="text-2xl mb-2">🎛️</p>
          <p className="font-semibold text-light">Mode personnalisé</p>
          <p className="text-sm mt-1" style={{ color: "var(--bg-muted)" }}>
            Configure ta liste de titres dans les paramètres de la session
          </p>
        </div>
      )}

      {/* Bouton lancer */}
      <Button
        variant="primary"
        size="lg"
        className="w-full justify-center"
        onClick={handleLaunch}
        disabled={mode === "genre" && !selectedGenre}
      >
        🎵 Lancer le Blind Test
      </Button>
    </div>
  );
}

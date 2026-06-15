"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  albumImage: string;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function KaraokePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/spotify/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error("Erreur de recherche");
      const data = (await res.json()) as Track[];
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-light">Karaoké 🎤</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--bg-muted)" }}>
          Cherche une chanson et chante avec tes amis
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artiste, titre, album..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button variant="secondary" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? "..." : "🔍"}
        </Button>
      </div>

      {/* Résultats */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-10" style={{ color: "var(--bg-muted)" }}>
          <div className="text-4xl mb-3">🎵</div>
          <p className="font-semibold">Aucun résultat trouvé</p>
          <p className="text-sm mt-1">Essaie un autre titre ou artiste</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </p>
          {results.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-2xl p-3 border card-hover"
              style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
            >
              {track.albumImage ? (
                <img
                  src={track.albumImage}
                  alt={track.title}
                  width={52}
                  height={52}
                  className="rounded-lg flex-shrink-0 object-cover"
                />
              ) : (
                <div
                  className="w-[52px] h-[52px] rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                  style={{ background: "var(--bg-muted)" }}
                >
                  🎵
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-light truncate">{track.title}</p>
                <p className="text-xs truncate" style={{ color: "var(--bg-muted)" }}>{track.artist}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--bg-muted)" }}>{formatDuration(track.duration)}</p>
              </div>
              <Button variant="primary" size="sm">
                Chanter
              </Button>
            </div>
          ))}
        </div>
      )}

      {!searched && (
        <div className="text-center py-12 flex flex-col items-center gap-3">
          <div className="text-5xl float-anim">🎤</div>
          <p className="font-semibold text-light">Recherche une chanson</p>
          <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
            Tape le nom d&apos;un artiste ou d&apos;un titre
          </p>
        </div>
      )}
    </div>
  );
}

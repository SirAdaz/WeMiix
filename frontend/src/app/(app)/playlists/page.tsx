"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Track {
  id: string;
  title: string;
  artist: string;
  albumImage: string;
  score: number;
  addedBy: string;
}

const INITIAL_TRACKS: Track[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", albumImage: "", score: 12, addedBy: "Alex" },
  { id: "2", title: "Shape of You", artist: "Ed Sheeran", albumImage: "", score: 8, addedBy: "Marie" },
  { id: "3", title: "Levitating", artist: "Dua Lipa", albumImage: "", score: 5, addedBy: "Lucas" },
  { id: "4", title: "Peaches", artist: "Justin Bieber", albumImage: "", score: 2, addedBy: "Toi" },
];

export default function PlaylistsPage() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [votes, setVotes] = useState<Record<string, 1 | -1 | 0>>({});

  const sortedTracks = [...tracks].sort((a, b) => b.score - a.score);

  const handleVote = (trackId: string, value: 1 | -1) => {
    const currentVote = votes[trackId] ?? 0;
    if (currentVote === value) return;

    const delta = value - currentVote;
    setVotes((prev) => ({ ...prev, [trackId]: value }));
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, score: t.score + delta } : t))
    );

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/playlists/tracks/${trackId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }).catch(() => {});
  };

  const handleAddTrack = () => {
    if (!searchQuery.trim()) return;
    const newTrack: Track = {
      id: Math.random().toString(36).slice(2),
      title: searchQuery.trim(),
      artist: "Artiste inconnu",
      albumImage: "",
      score: 0,
      addedBy: "Toi",
    };
    setTracks((prev) => [...prev, newTrack]);
    setSearchQuery("");
    setShowAdd(false);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6 pb-24">
      <div>
        <h1 className="text-3xl font-black text-light">Playlists 🎶</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--bg-muted)" }}>
          Votez pour les meilleurs titres de la soirée
        </p>
      </div>

      {/* Rechercher un titre */}
      {showAdd && (
        <div
          className="rounded-2xl p-4 border flex flex-col gap-3"
          style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
        >
          <p className="font-bold text-sm text-light">Ajouter un titre</p>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Titre ou artiste..."
              onKeyDown={(e) => e.key === "Enter" && handleAddTrack()}
              className="flex-1"
            />
            <Button variant="secondary" onClick={handleAddTrack} disabled={!searchQuery.trim()}>
              Ajouter
            </Button>
          </div>
          <button
            onClick={() => setShowAdd(false)}
            className="text-xs text-center"
            style={{ color: "var(--bg-muted)" }}
          >
            Annuler
          </button>
        </div>
      )}

      {/* Liste des tracks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
            {tracks.length} titre{tracks.length > 1 ? "s" : ""}
          </p>
          <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Trié par votes</p>
        </div>

        {sortedTracks.map((track, idx) => {
          const userVote = votes[track.id] ?? 0;
          return (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-2xl p-3 border"
              style={{
                background: "var(--bg-card)",
                borderColor: idx === 0 ? "var(--green)" : "var(--bg-muted)",
                borderLeftWidth: idx === 0 ? "3px" : "1px",
                borderLeftColor: idx === 0 ? "var(--green)" : "var(--bg-muted)",
              }}
            >
              {/* Rang */}
              <span className="w-6 text-center text-sm font-black" style={{ color: "var(--bg-muted)" }}>
                {idx === 0 ? "🔥" : idx + 1}
              </span>

              {/* Cover */}
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-xl"
                style={{ background: "var(--bg-muted)" }}
              >
                {track.albumImage ? (
                  <img src={track.albumImage} alt={track.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  "🎵"
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-light truncate">{track.title}</p>
                <p className="text-xs truncate" style={{ color: "var(--bg-muted)" }}>{track.artist}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--bg-muted)" }}>par {track.addedBy}</p>
              </div>

              {/* Votes */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleVote(track.id, 1)}
                  className="text-lg leading-none transition-transform hover:scale-125"
                  style={{ color: userVote === 1 ? "var(--green)" : "var(--bg-muted)" }}
                >
                  ▲
                </button>
                <span className="text-sm font-black" style={{ color: "var(--light)" }}>{track.score}</span>
                <button
                  onClick={() => handleVote(track.id, -1)}
                  className="text-lg leading-none transition-transform hover:scale-125"
                  style={{ color: userVote === -1 ? "var(--pink)" : "var(--bg-muted)" }}
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB Ajouter */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg glow-pink transition-transform hover:scale-110"
        style={{ background: "var(--pink)", color: "white" }}
        aria-label="Ajouter un titre"
      >
        +
      </button>
    </div>
  );
}

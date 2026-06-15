"use client";

import { use, useState } from "react";

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  addedBy: string;
  addedByAvatar: string;
  score: number;
  upvotes: number;
  downvotes: number;
  myVote: "up" | "down" | null;
}

const MAX_ADDS_PER_PERSON = 3;
const AUTO_REMOVE_THRESHOLD = -3;

const initialTracks: PlaylistTrack[] = [
  {
    id: "1", title: "Get Lucky", artist: "Daft Punk",
    addedBy: "Alex", addedByAvatar: "🎤",
    score: 8, upvotes: 10, downvotes: 2, myVote: null,
  },
  {
    id: "2", title: "Blinding Lights", artist: "The Weeknd",
    addedBy: "Sam", addedByAvatar: "🎵",
    score: 5, upvotes: 7, downvotes: 2, myVote: null,
  },
  {
    id: "3", title: "WAP", artist: "Cardi B",
    addedBy: "Léa", addedByAvatar: "🎶",
    score: -1, upvotes: 2, downvotes: 3, myVote: null,
  },
  {
    id: "4", title: "Around the World", artist: "Daft Punk",
    addedBy: "Max", addedByAvatar: "🎧",
    score: 3, upvotes: 4, downvotes: 1, myVote: null,
  },
];

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: _groupId } = use(params);
  const [tracks, setTracks] = useState<PlaylistTrack[]>(initialTracks);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<{ title: string; artist: string } | null>(null);
  const [myAdds, setMyAdds] = useState(1); // Déjà 1 ajout (Alex)
  const [notification, setNotification] = useState("");

  const sortedTracks = [...tracks].sort((a, b) => b.score - a.score);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    // Mock search — en prod : appel Spotify Web API
    setSearchResult({ title: search, artist: "Artiste suggéré" });
  }

  function addTrack() {
    if (!searchResult) return;
    if (myAdds >= MAX_ADDS_PER_PERSON) {
      showNotification(`Limite de ${MAX_ADDS_PER_PERSON} ajouts atteinte !`);
      return;
    }

    // Vérifier doublons
    const duplicate = tracks.some(
      (t) =>
        t.title.toLowerCase() === searchResult.title.toLowerCase() &&
        t.artist.toLowerCase() === searchResult.artist.toLowerCase()
    );
    if (duplicate) {
      showNotification("Ce titre est déjà dans la playlist !");
      return;
    }

    const newTrack: PlaylistTrack = {
      id: Date.now().toString(),
      title: searchResult.title,
      artist: searchResult.artist,
      addedBy: "Toi",
      addedByAvatar: "⭐",
      score: 0,
      upvotes: 0,
      downvotes: 0,
      myVote: null,
    };
    setTracks((prev) => [...prev, newTrack]);
    setMyAdds((n) => n + 1);
    setSearch("");
    setSearchResult(null);
    showNotification("Titre ajouté !");
  }

  function vote(trackId: string, direction: "up" | "down") {
    setTracks((prev) =>
      prev
        .map((t) => {
          if (t.id !== trackId) return t;

          let { upvotes, downvotes, myVote, score } = t;

          // Annuler le vote précédent
          if (myVote === "up") { upvotes--; score--; }
          if (myVote === "down") { downvotes--; score++; }

          // Appliquer le nouveau vote (ou annuler si même vote)
          if (myVote === direction) {
            myVote = null;
          } else {
            if (direction === "up") { upvotes++; score++; }
            else { downvotes++; score--; }
            myVote = direction;
          }

          return { ...t, upvotes, downvotes, score, myVote };
        })
        .filter((t) => t.score > AUTO_REMOVE_THRESHOLD)
    );
  }

  function removeTrack(trackId: string) {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    showNotification("Titre retiré.");
  }

  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  }

  return (
    <main className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg-muted)" }}>
            Playlist collab
          </p>
          <h1 className="text-xl font-black" style={{ color: "var(--light)" }}>
            🎶 La playlist du soir
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Tes ajouts</p>
          <p className="font-black" style={{ color: myAdds >= MAX_ADDS_PER_PERSON ? "var(--pink)" : "var(--green)" }}>
            {myAdds}/{MAX_ADDS_PER_PERSON}
          </p>
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full font-bold text-sm"
          style={{ background: "var(--bg-card)", color: "var(--green)", border: "1px solid var(--green)" }}
        >
          {notification}
        </div>
      )}

      {/* Ajouter un titre */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un titre…"
          disabled={myAdds >= MAX_ADDS_PER_PERSON}
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--bg-muted)",
            color: "var(--light)",
            opacity: myAdds >= MAX_ADDS_PER_PERSON ? 0.5 : 1,
          }}
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-xl font-bold text-sm"
          style={{ background: "var(--green)", color: "var(--bg-deep)" }}
        >
          🔍
        </button>
      </form>

      {/* Résultat de recherche */}
      {searchResult && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl border mb-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--green)" }}
        >
          <span className="text-2xl">💿</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: "var(--light)" }}>{searchResult.title}</p>
            <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{searchResult.artist}</p>
          </div>
          <button
            onClick={addTrack}
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: "var(--green)", color: "var(--bg-deep)" }}
          >
            + Ajouter
          </button>
        </div>
      )}

      {/* Règles */}
      <div className="text-xs mb-4 px-3 py-2 rounded-xl" style={{ background: "rgba(255,41,105,0.08)", color: "var(--bg-muted)" }}>
        📋 Max {MAX_ADDS_PER_PERSON} ajouts · Pas de doublons · Classement auto par votes ·{" "}
        <span style={{ color: "var(--pink)" }}>Score &lt; {AUTO_REMOVE_THRESHOLD} = suppression auto</span>
      </div>

      {/* Liste triée */}
      <div className="flex flex-col gap-3">
        {sortedTracks.map((track, position) => (
          <TrackRow
            key={track.id}
            track={track}
            position={position + 1}
            onVote={(dir) => vote(track.id, dir)}
            onRemove={track.addedBy === "Alex" ? () => removeTrack(track.id) : undefined}
          />
        ))}
      </div>
    </main>
  );
}

function TrackRow({
  track,
  position,
  onVote,
  onRemove,
}: {
  track: PlaylistTrack;
  position: number;
  onVote: (dir: "up" | "down") => void;
  onRemove?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
      style={{
        background: "var(--bg-card)",
        borderColor: track.score < 0 ? "rgba(255,41,105,0.3)" : "var(--bg-muted)",
      }}
    >
      {/* Position */}
      <span
        className="w-6 text-center font-black text-sm"
        style={{ color: position === 1 ? "var(--green)" : "var(--bg-muted)" }}
      >
        {position}
      </span>

      {/* Info track */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate" style={{ color: "var(--light)" }}>
          {track.title}
        </p>
        <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
          {track.artist} · {track.addedByAvatar} {track.addedBy}
        </p>
      </div>

      {/* Score */}
      <span
        className="text-sm font-black min-w-[2.5rem] text-center"
        style={{ color: track.score >= 0 ? "var(--green)" : "var(--pink)" }}
      >
        {track.score > 0 ? `+${track.score}` : track.score}
      </span>

      {/* Votes */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onVote("up")}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
          style={{
            background: track.myVote === "up" ? "rgba(39,233,101,0.2)" : "transparent",
            color: track.myVote === "up" ? "var(--green)" : "var(--bg-muted)",
          }}
        >
          ▲
        </button>
        <button
          onClick={() => onVote("down")}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
          style={{
            background: track.myVote === "down" ? "rgba(255,41,105,0.2)" : "transparent",
            color: track.myVote === "down" ? "var(--pink)" : "var(--bg-muted)",
          }}
        >
          ▼
        </button>
        {onRemove && (
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ color: "var(--bg-muted)" }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

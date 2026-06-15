"use client";

interface SpotifyPlayerProps {
  trackName: string;
  artistName: string;
  albumImage?: string;
  durationMs: number;
  isPlaying: boolean;
  currentMs: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function VinylPlaceholder() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      aria-label="Album placeholder"
    >
      <circle cx="50" cy="50" r="50" fill="#162936" />
      <circle cx="50" cy="50" r="38" fill="#0d1f2d" />
      <circle cx="50" cy="50" r="30" fill="#162936" />
      <circle cx="50" cy="50" r="22" fill="#0d1f2d" />
      <circle cx="50" cy="50" r="6" fill="#ff2969" />
      <path
        d="M50 12 A38 38 0 0 1 88 50"
        stroke="#3b5265"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M50 88 A38 38 0 0 1 12 50"
        stroke="#3b5265"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export default function SpotifyPlayer({
  trackName,
  artistName,
  albumImage,
  durationMs,
  isPlaying,
  currentMs,
  onPlayPause,
  onNext,
  onPrev,
}: SpotifyPlayerProps) {
  const progressPercent = durationMs > 0 ? (currentMs / durationMs) * 100 : 0;

  return (
    <div
      className="w-full rounded-2xl p-4 border"
      style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
    >
      {/* Album image */}
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
        {albumImage ? (
          <img
            src={albumImage}
            alt={`${trackName} — ${artistName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <VinylPlaceholder />
        )}
      </div>

      {/* Titre & artiste */}
      <div className="text-center mb-4">
        <p
          className="text-base font-bold truncate"
          style={{ color: "var(--light)" }}
        >
          {trackName}
        </p>
        <p className="text-sm truncate mt-0.5" style={{ color: "var(--bg-muted)" }}>
          {artistName}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="mb-1">
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-muted)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, var(--pink), var(--green))",
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "var(--bg-muted)" }}>
            {formatTime(currentMs)}
          </span>
          <span className="text-xs" style={{ color: "var(--bg-muted)" }}>
            {formatTime(durationMs)}
          </span>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={onPrev}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: "var(--light)" }}
          aria-label="Piste précédente"
        >
          <PrevIcon />
        </button>

        <button
          onClick={onPlayPause}
          className="w-14 h-14 flex items-center justify-center rounded-full font-bold transition-all hover:scale-110 shadow-lg"
          style={{ background: "var(--pink)", color: "#fff" }}
          aria-label={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: "var(--light)" }}
          aria-label="Piste suivante"
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z" />
    </svg>
  );
}

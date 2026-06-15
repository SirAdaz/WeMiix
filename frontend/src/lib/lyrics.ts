export interface LyricLine {
  time: number; // secondes
  text: string;
}

export interface TrackInfo {
  artist: string;
  title: string;
  album?: string;
  duration?: number;
}

/** Récupère les paroles synchronisées depuis LRCLIB, avec fallback sur lyrics.ovh */
export async function fetchLyrics(track: TrackInfo): Promise<LyricLine[]> {
  // 1. Tentative LRCLIB (paroles synchronisées LRC)
  try {
    const lrclibLines = await fetchFromLrclib(track);
    if (lrclibLines.length > 0) return lrclibLines;
  } catch {
    // fallback
  }

  // 2. Fallback lyrics.ovh (paroles non synchronisées)
  try {
    const plainLyrics = await fetchFromLyricsOvh(track);
    return plainLyricsToLines(plainLyrics);
  } catch {
    return [];
  }
}

async function fetchFromLrclib(track: TrackInfo): Promise<LyricLine[]> {
  const params = new URLSearchParams({
    artist_name: track.artist,
    track_name: track.title,
    ...(track.album ? { album_name: track.album } : {}),
    ...(track.duration ? { duration: String(Math.round(track.duration)) } : {}),
  });

  const res = await fetch(`https://lrclib.net/api/get?${params}`, {
    headers: { "Lrclib-Client": "WeMiix/0.1 (github.com/wemiix)" },
  });

  if (!res.ok) throw new Error("LRCLIB not found");

  const data = await res.json();

  if (data.syncedLyrics) {
    return parseLrc(data.syncedLyrics);
  }

  if (data.plainLyrics) {
    return plainLyricsToLines(data.plainLyrics);
  }

  throw new Error("No lyrics in LRCLIB response");
}

async function fetchFromLyricsOvh(track: TrackInfo): Promise<string> {
  const res = await fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(track.artist)}/${encodeURIComponent(track.title)}`
  );
  if (!res.ok) throw new Error("lyrics.ovh not found");
  const data = await res.json();
  return data.lyrics ?? "";
}

/** Parse le format LRC en tableau de lignes horodatées */
export function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const lineRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

  for (const line of lrc.split("\n")) {
    const match = line.match(lineRegex);
    if (!match) continue;
    const [, min, sec, cs, text] = match;
    const time =
      parseInt(min) * 60 +
      parseInt(sec) +
      parseInt(cs.padEnd(3, "0")) / 1000;
    lines.push({ time, text: text.trim() });
  }

  return lines.sort((a, b) => a.time - b.time);
}

/** Convertit des paroles non synchronisées en lignes régulières (estimation) */
function plainLyricsToLines(plain: string): LyricLine[] {
  const textLines = plain
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Distribution uniforme sur une durée estimée (3 min = 180s)
  const estimatedTotal = 180;
  const step = estimatedTotal / Math.max(textLines.length, 1);

  return textLines.map((text, i) => ({
    time: i * step,
    text,
  }));
}

/** Retourne l'index de la ligne active pour un temps donné */
export function getActiveLine(lines: LyricLine[], currentTime: number): number {
  let active = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= currentTime) active = i;
    else break;
  }
  return active;
}

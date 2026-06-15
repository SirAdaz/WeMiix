const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Groupes ─────────────────────────────────────────────────────────────────

export interface Group {
  id: string;
  name: string;
  code: string;
  mode: "adult" | "children";
  inviteLink: string;
}

export function createGroup(name: string, mode: "adult" | "children"): Promise<Group> {
  return apiFetch<Group>("/api/groups", {
    method: "POST",
    body: JSON.stringify({ name, mode }),
  });
}

export function joinGroup(code: string, guestName?: string): Promise<{ groupId: string }> {
  return apiFetch<{ groupId: string }>(`/api/groups/${code}/join`, {
    method: "POST",
    body: JSON.stringify({ guestName }),
  });
}

// ── Spotify ──────────────────────────────────────────────────────────────────

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  albumImage: string;
  duration: number;
  previewUrl: string | null;
}

export function searchTracks(query: string, accessToken?: string): Promise<SpotifyTrack[]> {
  return apiFetch<SpotifyTrack[]>("/api/spotify/search", {
    method: "POST",
    body: JSON.stringify({ query, accessToken }),
  });
}

// ── Karaoké ──────────────────────────────────────────────────────────────────

export interface LyricsLine {
  text: string;
  startTime: number;
  endTime: number;
}

export interface KaraokeSession {
  id: string;
  songTitle: string;
  artist: string;
  duration: number;
  lyrics: LyricsLine[] | null;
}

export function getLyrics(sessionId: string): Promise<KaraokeSession> {
  return apiFetch<KaraokeSession>(`/api/karaoke/sessions/${sessionId}/lyrics`);
}

// ── Playlists ─────────────────────────────────────────────────────────────────

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  albumImage: string;
  score: number;
  addedBy: string;
}

export function addTrackToPlaylist(
  playlistId: string,
  track: Omit<PlaylistTrack, "id" | "score">
): Promise<PlaylistTrack> {
  return apiFetch<PlaylistTrack>(`/api/playlists/${playlistId}/tracks`, {
    method: "POST",
    body: JSON.stringify(track),
  });
}

export function voteTrack(trackId: string, value: 1 | -1): Promise<{ score: number }> {
  return apiFetch<{ score: number }>(`/api/playlists/tracks/${trackId}/vote`, {
    method: "POST",
    body: JSON.stringify({ value }),
  });
}

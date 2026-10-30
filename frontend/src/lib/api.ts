import { fetchWithAuth } from "@/lib/auth";

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

export type GroupMode = "adult" | "children";

export interface GroupMember {
  id: number;
  name: string;
  role: "host" | "guest";
}

export interface Group {
  id: number;
  name: string;
  code: string;
  mode: GroupMode;
  inviteLink: string;
  /** Présent uniquement sur la page d'un groupe (GET /api/groups/{id}/overview). */
  members?: GroupMember[];
}

export interface JoinedGroup {
  groupId: number;
  memberId: number;
  role: "host" | "guest";
}

/** Appel authentifié (JWT, refresh automatique) : tout /api/groups exige un jeton. */
async function groupRequest<T>(path: string, fallbackMessage: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithAuth(path, options);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? fallbackMessage);
  }
  return (await res.json()) as T;
}

export function createGroup(name: string, mode: GroupMode): Promise<Group> {
  return groupRequest<Group>("/api/groups", "Erreur lors de la création", {
    method: "POST",
    body: JSON.stringify({ name, mode }),
  });
}

/** Rejoint un groupe par son code d'invitation ; rejoindre deux fois renvoie le même groupe. */
export function joinGroup(code: string): Promise<JoinedGroup> {
  return groupRequest<JoinedGroup>(`/api/groups/${encodeURIComponent(code)}/join`, "Code invalide", {
    method: "POST",
  });
}

export function getGroupOverview(groupId: string): Promise<Group> {
  return groupRequest<Group>(`/api/groups/${encodeURIComponent(groupId)}/overview`, "Groupe introuvable");
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

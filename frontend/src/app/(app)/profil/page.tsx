"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL } from "@/lib/auth";

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div
        className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
        style={{ borderTopColor: "var(--pink)", borderRightColor: "var(--green)" }}
        aria-label="Chargement"
      />
    </div>
  );
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

export default function ProfilPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  if (isLoading) return <Spinner />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-6">
        <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
          Tu n'es pas connecté.
        </p>
      </div>
    );
  }

  async function handleConnectSpotify() {
    setSpotifyLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/spotify/authorize`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch {
      setSpotifyLoading(false);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);
    await logout();
    router.replace("/connexion");
  }

  return (
    <div className="flex flex-col items-center px-6 py-8 max-w-md mx-auto gap-6">
      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shadow-lg"
        style={{ background: "var(--pink)", color: "#fff" }}
      >
        {getInitials(user.username)}
      </div>

      {/* Infos */}
      <div className="text-center">
        <h1
          className="text-xl font-black"
          style={{ color: "var(--light)", fontFamily: "var(--font-league-spartan)" }}
        >
          {user.username}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--bg-muted)" }}>
          {user.email}
        </p>
      </div>

      {/* Badge plan */}
      <div
        className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase"
        style={
          user.plan === "PREMIUM"
            ? { background: "rgba(39,233,101,0.15)", color: "var(--green)" }
            : { background: "rgba(59,82,101,0.4)", color: "var(--bg-muted)" }
        }
      >
        {user.plan ?? "FREE"}
      </div>

      {/* Carte Spotify */}
      <div
        className="w-full rounded-2xl p-4 border"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "#1DB954" }}
            >
              <SpotifyIcon />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--light)" }}>
                Spotify
              </p>
              <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
                {user.spotifyConnected ? "Compte connecté" : "Non connecté"}
              </p>
            </div>
          </div>

          {user.spotifyConnected ? (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "rgba(39,233,101,0.15)", color: "var(--green)" }}
            >
              ✓ Connecté
            </span>
          ) : (
            <button
              onClick={handleConnectSpotify}
              disabled={spotifyLoading}
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "#1DB954" }}
            >
              {spotifyLoading ? "…" : "Connecter"}
            </button>
          )}
        </div>
      </div>

      {/* Bouton déconnexion */}
      <button
        onClick={handleLogout}
        disabled={logoutLoading}
        className="w-full py-3 rounded-full text-sm font-bold border transition-all hover:bg-red-500/10 disabled:opacity-50"
        style={{
          borderColor: "var(--bg-muted)",
          color: "var(--bg-muted)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--bg-muted)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--bg-muted)";
        }}
      >
        {logoutLoading ? "Déconnexion…" : "Se déconnecter"}
      </button>

      {/* Supprimer compte */}
      <button
        className="text-xs transition-opacity hover:opacity-80 mt-2"
        style={{ color: "#ef4444", opacity: 0.5 }}
        onClick={() => {
          if (window.confirm("Supprimer définitivement ton compte ? Cette action est irréversible.")) {
            // À implémenter
          }
        }}
      >
        Supprimer mon compte
      </button>
    </div>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

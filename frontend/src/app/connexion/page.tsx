"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BASE_URL, saveTokens, setGuestMode, type User } from "@/lib/auth";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? `Erreur ${res.status}`);
      }

      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
        user: User;
      };

      saveTokens(data.accessToken, data.refreshToken);
      setGuestMode(false);
      router.replace("/groupe");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function handleSpotify() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/spotify/authorize`);
      if (!res.ok) throw new Error("Impossible de contacter Spotify");
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur Spotify");
      setLoading(false);
    }
  }

  function handleGuest() {
    setGuestMode(true);
    router.replace("/groupe");
  }

  return (
    <div className="w-full max-w-sm py-12">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/" className="select-none">
          <span
            className="text-3xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-league-spartan)" }}
          >
            <span style={{ color: "var(--green)" }}>We</span>
            <span style={{ color: "var(--light)" }}>M</span>
            <span style={{ color: "var(--pink)" }}>ii</span>
            <span style={{ color: "var(--light)" }}>x</span>
          </span>
        </Link>
      </div>

      <div
        className="w-full rounded-2xl p-6 border"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        {/* Titre */}
        <h1
          className="text-xl font-black text-center mb-6"
          style={{ color: "var(--light)" }}
        >
          Rejoins la fête 🎉
        </h1>

        {/* Bouton Spotify */}
        <button
          onClick={handleSpotify}
          disabled={loading}
          className="w-full py-3.5 rounded-full font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
          style={{ background: "#1DB954" }}
        >
          <SpotifyIcon />
          Continuer avec Spotify
        </button>

        {/* Séparateur */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1" style={{ borderColor: "var(--bg-muted)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--bg-muted)" }}>
            ou
          </span>
          <hr className="flex-1" style={{ borderColor: "var(--bg-muted)" }} />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="text-xs font-semibold mb-1.5 block"
              style={{ color: "var(--bg-muted)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="toi@exemple.fr"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border focus:border-pink-500 transition-colors"
              style={{
                background: "var(--bg-deep)",
                borderColor: "var(--bg-muted)",
                color: "var(--light)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1.5 block"
              style={{ color: "var(--bg-muted)" }}
            >
              Pseudo
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="TonPseudo"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border focus:border-pink-500 transition-colors"
              style={{
                background: "var(--bg-deep)",
                borderColor: "var(--bg-muted)",
                color: "var(--light)",
              }}
            />
          </div>

          {error && (
            <p
              className="text-xs rounded-lg px-3 py-2"
              style={{ background: "rgba(255,41,105,0.15)", color: "var(--pink)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-bold text-white text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 glow-pink mt-1"
            style={{ background: "var(--pink)" }}
          >
            {loading ? "Chargement…" : "Connexion"}
          </button>
        </form>
      </div>

      {/* Mode invité */}
      <div className="text-center mt-6">
        <button
          onClick={handleGuest}
          className="text-sm transition-opacity hover:opacity-80"
          style={{ color: "var(--bg-muted)" }}
        >
          Continuer en mode invité →
        </button>
      </div>
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

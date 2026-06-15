"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveTokens, fetchWithAuth } from "@/lib/auth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Aucun token reçu. La connexion Spotify a échoué.");
      return;
    }

    async function handleCallback() {
      saveTokens(token!, null);
      try {
        const res = await fetchWithAuth("/api/auth/me");
        if (!res.ok) throw new Error("Impossible de récupérer le profil utilisateur.");
        router.replace("/groupe");
      } catch {
        setError("Erreur lors de la récupération du profil. Veuillez réessayer.");
      }
    }

    void handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="w-full max-w-sm text-center py-12">
        <div
          className="rounded-2xl p-6 border"
          style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
        >
          <div className="text-4xl mb-4">😕</div>
          <p
            className="text-sm font-semibold mb-6"
            style={{ color: "var(--light)" }}
          >
            {error}
          </p>
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
            style={{ background: "var(--pink)" }}
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <Spinner />
      <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
        Connexion Spotify en cours…
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <div
      className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
      style={{
        borderTopColor: "var(--pink)",
        borderRightColor: "var(--green)",
      }}
      aria-label="Chargement"
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg-deep)" }}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
              Chargement…
            </p>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}

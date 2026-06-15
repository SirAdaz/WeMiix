"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function JoinGroupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paramCode = searchParams.get("code");
    if (paramCode) setCode(paramCode.toUpperCase());
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/groups/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName: pseudo || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message ?? "Code invalide");
      }
      const data = (await res.json()) as { groupId: string };
      router.push(`/groups/${data.groupId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: "var(--light)" }}>
          Code d&apos;invitation
        </label>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="EX: AB12CD"
          maxLength={6}
          className="text-center font-black tracking-[0.3em] text-xl uppercase"
        />
        <p className="mt-1 text-xs" style={{ color: "var(--bg-muted)" }}>
          6 caractères, lettres et chiffres
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: "var(--light)" }}>
          Ton pseudo <span style={{ color: "var(--bg-muted)" }}>(optionnel)</span>
        </label>
        <Input
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value.slice(0, 20))}
          placeholder="Comment t'appelles-tu ?"
          maxLength={20}
        />
      </div>

      {error && (
        <p className="text-sm font-semibold text-center rounded-xl p-3" style={{ background: "rgba(255,41,105,0.15)", color: "var(--pink)" }}>
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        disabled={code.length !== 6 || loading}
        className="w-full justify-center"
      >
        {loading ? "Connexion..." : "Rejoindre la session"}
      </Button>
    </form>
  );
}

export default function JoinGroupPage() {
  return (
    <div className="px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-light mb-2">Rejoindre une session</h1>
        <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
          Demande le code à l&apos;hôte de la session
        </p>
      </div>
      <Suspense fallback={null}>
        <JoinGroupForm />
      </Suspense>
    </div>
  );
}

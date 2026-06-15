"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type GroupMode = "adult" | "children";

interface CreatedGroup {
  id: string;
  code: string;
  inviteLink: string;
}

export default function CreateGroupPage() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<GroupMode>("adult");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedGroup | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), mode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message ?? "Erreur lors de la création");
      }
      const data = (await res.json()) as CreatedGroup;
      setCreated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const qrUrl = created
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(created.inviteLink)}`
    : null;

  if (created) {
    return (
      <div className="px-4 py-8 max-w-md mx-auto text-center flex flex-col gap-6">
        <div>
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-black text-light">Session créée !</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--bg-muted)" }}>
            Partage ce code ou ce QR code avec tes amis
          </p>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>Code d&apos;invitation</p>
          <p className="text-4xl font-black tracking-[0.3em]" style={{ color: "var(--green)" }}>
            {created.code}
          </p>
        </div>

        {qrUrl && (
          <div className="flex justify-center">
            <div
              className="p-4 rounded-2xl border"
              style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
            >
              <img
                src={qrUrl}
                alt="QR code d'invitation"
                width={180}
                height={180}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full justify-center"
            onClick={handleCopy}
          >
            {copied ? "✅ Lien copié !" : "📋 Copier le lien"}
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full justify-center"
            onClick={() => { window.location.href = `/groups/${created.id}`; }}
          >
            Entrer dans la session →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🚀</div>
        <h1 className="text-2xl font-black text-light mb-2">Nouvelle session</h1>
        <p className="text-sm" style={{ color: "var(--bg-muted)" }}>
          Configure ta session et invite tes amis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: "var(--light)" }}>
            Nom de la session
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder="Ex: Soirée du vendredi soir 🎉"
            maxLength={40}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-3" style={{ color: "var(--light)" }}>
            Mode
          </label>
          <div className="flex gap-3">
            {(["adult", "children"] as const).map((m) => {
              const isSelected = mode === m;
              const label = m === "adult" ? "🔞 Adulte" : "👧 Enfant";
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: isSelected ? (m === "adult" ? "var(--pink)" : "var(--green)") : "var(--bg-card)",
                    color: isSelected ? (m === "adult" ? "white" : "var(--bg-deep)") : "var(--bg-muted)",
                    border: `1px solid ${isSelected ? "transparent" : "var(--bg-muted)"}`,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-sm font-semibold text-center rounded-xl p-3" style={{ background: "rgba(255,41,105,0.15)", color: "var(--pink)" }}>
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!name.trim() || loading}
          className="w-full justify-center"
        >
          {loading ? "Création..." : "🚀 Créer la session"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCodeDisplay from "@/components/QRCodeDisplay";

type Step = "choice" | "create" | "join" | "created";

export default function GroupePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choice");
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createdId, setCreatedId] = useState("");
  const [error, setError] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Donne un nom à ton groupe !");
      return;
    }
    const id = crypto.randomUUID().slice(0, 8).toUpperCase();
    setCreatedId(id);
    setStep("created");
    // En prod : appel API pour persister le groupe
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      setError("Entre un code de groupe !");
      return;
    }
    router.push(`/groupe/${code}`);
  }

  function handleEnter() {
    router.push(`/groupe/${createdId}`);
  }

  if (step === "created") {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/groupe/${createdId}`;
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-6"
        style={{ background: "var(--bg-deep)" }}
      >
        <WeMiixLogo />
        <div
          className="w-full max-w-sm rounded-2xl p-6 border flex flex-col items-center gap-5"
          style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
        >
          <div className="text-4xl">🎉</div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--bg-muted)" }}>
              Groupe créé !
            </p>
            <h1 className="text-2xl font-black" style={{ color: "var(--light)" }}>
              {groupName}
            </h1>
          </div>

          {/* QR Code */}
          <QRCodeDisplay url={url} />

          {/* Code invite */}
          <div className="w-full rounded-xl p-4 border text-center" style={{ borderColor: "var(--bg-muted)", background: "var(--bg-deep)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--bg-muted)" }}>
              Code d&apos;invitation
            </p>
            <p className="text-3xl font-black tracking-[0.3em]" style={{ color: "var(--green)" }}>
              {createdId}
            </p>
          </div>

          {/* Share */}
          <button
            onClick={() => navigator.clipboard?.writeText(url)}
            className="w-full py-3 rounded-full font-bold text-sm border transition-all hover:scale-105"
            style={{ borderColor: "var(--bg-muted)", color: "var(--light)" }}
          >
            📋 Copier le lien
          </button>

          <button
            onClick={handleEnter}
            className="w-full py-3.5 rounded-full font-bold text-white text-sm transition-all hover:scale-105 glow-pink"
            style={{ background: "var(--pink)" }}
          >
            🚀 Entrer dans le groupe
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "var(--bg-deep)" }}
    >
      <WeMiixLogo />

      <div
        className="w-full max-w-sm rounded-2xl border mt-8"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        {step === "choice" && (
          <div className="p-6 flex flex-col gap-4">
            <h1 className="text-xl font-black text-center" style={{ color: "var(--light)" }}>
              Rejoins la fête 🎉
            </h1>
            <p className="text-sm text-center" style={{ color: "var(--bg-muted)" }}>
              Lance une session ou rejoins un groupe existant
            </p>

            <button
              onClick={() => setStep("create")}
              className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-3 transition-all hover:scale-105 glow-pink"
              style={{ background: "var(--pink)" }}
            >
              <span className="text-2xl">🚀</span>
              Créer un groupe
            </button>

            <button
              onClick={() => setStep("join")}
              className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-105 glow-green"
              style={{ background: "var(--green)", color: "var(--bg-deep)" }}
            >
              <span className="text-2xl">🔗</span>
              Rejoindre un groupe
            </button>

            <Link
              href="/connexion"
              className="text-center text-xs underline"
              style={{ color: "var(--bg-muted)" }}
            >
              Se connecter / Créer un compte
            </Link>
          </div>
        )}

        {step === "create" && (
          <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => { setStep("choice"); setError(""); }}
              className="text-sm self-start flex items-center gap-1"
              style={{ color: "var(--bg-muted)" }}
            >
              ← Retour
            </button>
            <h2 className="text-lg font-black" style={{ color: "var(--light)" }}>
              Nouveau groupe
            </h2>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--bg-muted)" }}>
                Nom du groupe
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="ex. Soirée chez Jules 🎶"
                maxLength={40}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                style={{
                  background: "var(--bg-deep)",
                  borderColor: "var(--bg-muted)",
                  color: "var(--light)",
                }}
              />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(255,41,105,0.15)", color: "var(--pink)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white text-sm transition-all hover:scale-105 glow-pink"
              style={{ background: "var(--pink)" }}
            >
              Créer le groupe
            </button>
          </form>
        )}

        {step === "join" && (
          <form onSubmit={handleJoin} className="p-6 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => { setStep("choice"); setError(""); }}
              className="text-sm self-start flex items-center gap-1"
              style={{ color: "var(--bg-muted)" }}
            >
              ← Retour
            </button>
            <h2 className="text-lg font-black" style={{ color: "var(--light)" }}>
              Rejoindre un groupe
            </h2>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--bg-muted)" }}>
                Code du groupe
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ex. A1B2C3D4"
                maxLength={8}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border tracking-widest text-center font-bold"
                style={{
                  background: "var(--bg-deep)",
                  borderColor: "var(--bg-muted)",
                  color: "var(--green)",
                }}
              />
            </div>

            <p className="text-xs text-center" style={{ color: "var(--bg-muted)" }}>
              Ou scanne le QR code de l&apos;hôte
            </p>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(255,41,105,0.15)", color: "var(--pink)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 glow-green"
              style={{ background: "var(--green)", color: "var(--bg-deep)" }}
            >
              Rejoindre
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function WeMiixLogo() {
  return (
    <Link href="/" className="select-none">
      <span
        className="text-2xl font-black tracking-tight"
        style={{ fontFamily: "var(--font-league-spartan)" }}
      >
        <span style={{ color: "var(--green)" }}>We</span>
        <span style={{ color: "var(--light)" }}>M</span>
        <span style={{ color: "var(--pink)" }}>ii</span>
        <span style={{ color: "var(--light)" }}>x</span>
      </span>
    </Link>
  );
}

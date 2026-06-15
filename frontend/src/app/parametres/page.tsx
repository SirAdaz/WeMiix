"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMode, setMode, type AppMode } from "@/lib/mode";

export default function ParametresPage() {
  const [mode, setModeState] = useState<AppMode>("adult");
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [fontSize, setFontSize] = useState(100);
  const [colorBlind, setColorBlind] = useState(false);
  const [saved, setSaved] = useState(false);

  const CHILD_LOCK_PIN = "1234"; // En prod : stocké côté serveur, hashé

  useEffect(() => {
    setModeState(getMode());
    const stored = localStorage.getItem("wemiix_font_size");
    if (stored) setFontSize(Number(stored));
    setColorBlind(localStorage.getItem("wemiix_colorblind") === "1");
  }, []);

  function handleModeSwitch(target: AppMode) {
    if (target === "adult" && mode === "child") {
      // Demande le PIN pour sortir du mode enfant
      setShowPinModal(true);
    } else if (target === "child") {
      setMode("child");
      setModeState("child");
      showSaved();
    }
  }

  function confirmPin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === CHILD_LOCK_PIN) {
      setMode("adult");
      setModeState("adult");
      setShowPinModal(false);
      setPin("");
      showSaved();
    } else {
      setPinError("PIN incorrect");
      setPin("");
    }
  }

  function handleFontSize(val: number) {
    setFontSize(val);
    localStorage.setItem("wemiix_font_size", String(val));
    document.documentElement.style.fontSize = `${val}%`;
  }

  function handleColorBlind(val: boolean) {
    setColorBlind(val);
    localStorage.setItem("wemiix_colorblind", val ? "1" : "0");
    document.documentElement.classList.toggle("colorblind", val);
  }

  function showSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(5,24,37,0.95)" }}>
          <div
            className="w-full max-w-xs rounded-2xl p-6 border flex flex-col gap-4"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
          >
            <div className="text-center">
              <p className="text-2xl mb-1">🔒</p>
              <p className="font-black" style={{ color: "var(--light)" }}>Code parental</p>
              <p className="text-xs mt-1" style={{ color: "var(--bg-muted)" }}>
                Entre le PIN pour passer en mode adulte
              </p>
            </div>
            <form onSubmit={confirmPin} className="flex flex-col gap-3">
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(""); }}
                placeholder="••••"
                maxLength={6}
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-center text-xl font-black outline-none border tracking-widest"
                style={{ background: "var(--bg-deep)", borderColor: pinError ? "var(--pink)" : "var(--bg-muted)", color: "var(--light)" }}
              />
              {pinError && <p className="text-xs text-center" style={{ color: "var(--pink)" }}>{pinError}</p>}
              <button type="submit" className="w-full py-3 rounded-full font-bold text-white glow-pink" style={{ background: "var(--pink)" }}>
                Confirmer
              </button>
              <button type="button" onClick={() => { setShowPinModal(false); setPin(""); setPinError(""); }} className="text-sm text-center" style={{ color: "var(--bg-muted)" }}>
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="px-4 pt-6 pb-20 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-sm" style={{ color: "var(--bg-muted)" }}>← Retour</Link>
          {saved && <span className="text-xs font-bold" style={{ color: "var(--green)" }}>✓ Sauvegardé</span>}
        </div>

        <h1 className="text-2xl font-black mb-6" style={{ color: "var(--light)" }}>⚙️ Paramètres</h1>

        {/* MODE ENFANT / ADULTE */}
        <section className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
            Mode d&apos;utilisation
          </p>
          <div
            className="rounded-2xl p-4 border"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
          >
            <div className="flex gap-3 mb-3">
              <ModeButton
                label="👶 Mode Enfant"
                description="Contenu filtré, restrictions UI"
                active={mode === "child"}
                onClick={() => handleModeSwitch("child")}
              />
              <ModeButton
                label="👤 Mode Adulte"
                description="Accès complet, aucune restriction"
                active={mode === "adult"}
                onClick={() => handleModeSwitch("adult")}
              />
            </div>
            {mode === "child" && (
              <div
                className="text-xs px-3 py-2 rounded-xl"
                style={{ background: "rgba(39,233,101,0.1)", color: "var(--green)" }}
              >
                🛡️ Mode enfant actif — contenu explicite filtré, navigation restreinte, sortie protégée par PIN
              </div>
            )}
            {mode === "adult" && (
              <div
                className="text-xs px-3 py-2 rounded-xl"
                style={{ background: "rgba(59,82,101,0.3)", color: "var(--bg-muted)" }}
              >
                ℹ️ En mode enfant, un PIN parental (1234 par défaut) protège le retour en mode adulte
              </div>
            )}
          </div>
        </section>

        {/* SPOTIFY */}
        <section className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
            Connexion musicale
          </p>
          <div
            className="rounded-2xl p-4 border flex items-center gap-4"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
          >
            <span className="text-3xl">🎧</span>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: "var(--light)" }}>Spotify</p>
              <p className="text-xs" style={{ color: "var(--bg-muted)" }}>
                {spotifyConnected ? "Connecté — lecture et recherche activées" : "Non connecté — connexion requise pour la lecture"}
              </p>
            </div>
            <button
              onClick={() => setSpotifyConnected((c) => !c)}
              className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{
                background: spotifyConnected ? "rgba(59,82,101,0.4)" : "#1DB954",
                color: spotifyConnected ? "var(--bg-muted)" : "#fff",
              }}
            >
              {spotifyConnected ? "Déconnecter" : "Connecter"}
            </button>
          </div>
        </section>

        {/* ACCESSIBILITÉ */}
        <section className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
            Accessibilité (WCAG)
          </p>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
          >
            {/* Taille de police */}
            <div className="flex items-center gap-4 px-4 py-4 border-b" style={{ borderColor: "var(--bg-muted)" }}>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "var(--light)" }}>Taille du texte</p>
                <p className="text-xs" style={{ color: "var(--bg-muted)" }}>{fontSize}%</p>
              </div>
              <input
                type="range"
                min={80}
                max={150}
                step={10}
                value={fontSize}
                onChange={(e) => handleFontSize(Number(e.target.value))}
                className="w-32"
              />
            </div>

            {/* Mode daltonien */}
            <div className="flex items-center gap-4 px-4 py-4">
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "var(--light)" }}>Mode daltonien</p>
                <p className="text-xs" style={{ color: "var(--bg-muted)" }}>Adapte les couleurs pour les daltoniens</p>
              </div>
              <Toggle value={colorBlind} onChange={handleColorBlind} />
            </div>
          </div>
        </section>

        {/* COMPTE */}
        <section className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
            Compte
          </p>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
          >
            <Link
              href="/connexion"
              className="flex items-center gap-3 px-4 py-4 border-b hover:bg-white/5 transition-colors"
              style={{ borderColor: "var(--bg-muted)" }}
            >
              <span className="text-xl">🔐</span>
              <span className="flex-1 text-sm font-bold" style={{ color: "var(--light)" }}>Connexion / Inscription</span>
              <span style={{ color: "var(--bg-muted)" }}>›</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-4 border-b hover:bg-white/5 transition-colors" style={{ borderColor: "var(--bg-muted)" }}>
              <span className="text-xl">📧</span>
              <span className="flex-1 text-sm font-bold text-left" style={{ color: "var(--light)" }}>Exercer mes droits RGPD</span>
              <span style={{ color: "var(--bg-muted)" }}>›</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors">
              <span className="text-xl">🗑️</span>
              <span className="flex-1 text-sm font-bold text-left" style={{ color: "var(--pink)" }}>Supprimer mon compte</span>
              <span style={{ color: "var(--bg-muted)" }}>›</span>
            </button>
          </div>
        </section>

        {/* PREMIUM */}
        <section>
          <div
            className="rounded-2xl p-4 border"
            style={{
              background: "linear-gradient(135deg, rgba(255,41,105,0.1), rgba(39,233,101,0.1))",
              borderColor: "var(--pink)",
            }}
          >
            <p className="font-black text-base mb-1" style={{ color: "var(--light)" }}>
              ⭐ WeMiix Premium
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--bg-muted)" }}>
              Sans pub · IA avancée · Recommandations personnalisées · 5€/mois
            </p>
            <button
              className="w-full py-3 rounded-full font-bold text-white text-sm glow-pink"
              style={{ background: "var(--pink)" }}
            >
              Essayer 7 jours gratuits
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ModeButton({
  label, description, active, onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col gap-1 p-3 rounded-xl border transition-all text-left"
      style={{
        background: active ? "rgba(255,41,105,0.1)" : "transparent",
        borderColor: active ? "var(--pink)" : "var(--bg-muted)",
      }}
    >
      <p className="font-bold text-sm" style={{ color: active ? "var(--pink)" : "var(--light)" }}>
        {label}
      </p>
      <p className="text-[10px]" style={{ color: "var(--bg-muted)" }}>{description}</p>
    </button>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors"
      style={{ background: value ? "var(--green)" : "var(--bg-muted)" }}
      role="switch"
      aria-checked={value}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
        style={{ transform: value ? "translateX(26px)" : "translateX(4px)" }}
      />
    </button>
  );
}

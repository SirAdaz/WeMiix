"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Bonne nuit";
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

const FEATURES = [
  { emoji: "🎤", title: "Karaoké", description: "Paroles en temps réel", href: "/karaoke", accent: "var(--green)" },
  { emoji: "🎵", title: "Blind Test", description: "Devine avant les autres", href: "/blindtest", accent: "var(--pink)" },
  { emoji: "🎶", title: "Playlists", description: "Construis la playlist ensemble", href: "/playlists", accent: "var(--green)" },
  { emoji: "🕹️", title: "Mini-jeux", description: "Défis et quiz musicaux", href: "/minigames", accent: "var(--pink)" },
] as const;

export default function HomePage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (code.trim().length === 6) {
      router.push(`/groups/join?code=${code.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col gap-8 max-w-lg mx-auto">
      {/* Greeting */}
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--bg-muted)" }}>
          {getGreeting()} 👋
        </p>
        <h1 className="text-3xl font-black text-light">Prêt pour la fête ?</h1>
      </div>

      {/* Rejoindre une session */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Rejoindre une session
        </h2>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="Code à 6 chiffres"
            maxLength={6}
            className="flex-1 text-center font-bold tracking-widest uppercase text-lg"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          <Button variant="secondary" onClick={handleJoin} disabled={code.length !== 6}>
            Rejoindre
          </Button>
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--bg-muted)" }}>
          Entre le code partagé par le créateur de la session
        </p>
      </section>

      {/* Créer une session */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Créer une session
        </h2>
        <Link href="/groups/create" className="block">
          <Button variant="primary" className="w-full text-center justify-center gap-2">
            🚀 Nouvelle session
          </Button>
        </Link>
      </section>

      {/* Fonctionnalités */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Fonctionnalités
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map(({ emoji, title, description, href, accent }) => (
            <Link key={href} href={href}>
              <Card accent={accent} className="h-full">
                <div className="text-3xl mb-2">{emoji}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: accent }}>
                  {title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--bg-muted)" }}>
                  {description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { getGroupOverview, type Group } from "@/lib/api";

const ACTION_BUTTONS = [
  { emoji: "🎤", label: "Lancer Karaoké", href: "/karaoke", accent: "var(--green)" as const },
  { emoji: "🎵", label: "Lancer Blind Test", href: "/blindtest", accent: "var(--pink)" as const },
  { emoji: "🎶", label: "Voir Playlist", href: "/playlists", accent: "var(--green)" as const },
  { emoji: "🕹️", label: "Mini-jeux", href: "/minigames", accent: "var(--pink)" as const },
] as const;

export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGroupOverview(groupId)
      .then(setGroup)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Groupe introuvable"))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 float-anim">🎵</div>
          <p style={{ color: "var(--text-muted)" }}>Chargement…</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="px-4 py-8 max-w-md mx-auto text-center flex flex-col gap-4">
        <p role="alert" className="text-sm font-semibold rounded-xl p-3" style={{ background: "rgba(255,41,105,0.15)", color: "var(--pink)" }}>
          {error ?? "Groupe introuvable"}
        </p>
        <Link href="/groups/join">
          <Button variant="secondary" size="md" className="w-full justify-center">Rejoindre avec un code</Button>
        </Link>
      </div>
    );
  }

  const members = group.members ?? [];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      {/* En-tête */}
      <div
        className="rounded-2xl p-5 border text-center"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        <h1 className="text-2xl font-black text-light mb-1">{group.name}</h1>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="muted">Code : {group.code}</Badge>
          <Badge variant="green">{members.length} membre{members.length > 1 ? "s" : ""}</Badge>
        </div>
      </div>

      {/* Membres */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          Membres
        </h2>
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl px-4 py-3 border"
              style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: "var(--bg-muted)", color: "var(--light)" }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-light">{member.name}</span>
              </div>
              <Badge variant={member.role === "host" ? "pink" : "muted"}>
                {member.role === "host" ? "Hôte" : "Invité"}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          Lancer une activité
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {ACTION_BUTTONS.map(({ emoji, label, href, accent }) => (
            <Link key={href} href={href}>
              <div
                className="rounded-2xl p-4 border card-hover cursor-pointer flex flex-col items-center gap-2 text-center"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--bg-muted)",
                  borderTopWidth: "2px",
                  borderTopColor: accent,
                }}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="font-bold text-sm" style={{ color: accent }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quitter */}
      <Button variant="ghost" size="md" className="w-full justify-center" onClick={() => { window.history.back(); }}>
        Quitter la session
      </Button>
    </div>
  );
}

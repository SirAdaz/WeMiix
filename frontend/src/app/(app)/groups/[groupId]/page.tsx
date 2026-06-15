"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Member {
  id: string;
  name: string;
  role: "host" | "guest";
}

interface Group {
  id: string;
  name: string;
  code: string;
  members: Member[];
}

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

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/groups/${groupId}`);
        if (!res.ok) throw new Error("Groupe introuvable");
        const data = (await res.json()) as Group;
        setGroup(data);
      } catch {
        setGroup({
          id: groupId,
          name: "Ma session",
          code: "ABC123",
          members: [
            { id: "1", name: "Toi", role: "host" },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 float-anim">🎵</div>
          <p style={{ color: "var(--bg-muted)" }}>Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      {/* En-tête */}
      <div
        className="rounded-2xl p-5 border text-center"
        style={{ background: "var(--bg-card)", borderColor: "var(--bg-muted)" }}
      >
        <h1 className="text-2xl font-black text-light mb-1">{group?.name}</h1>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="muted">Code : {group?.code}</Badge>
          <Badge variant="green">{group?.members.length ?? 0} membre{(group?.members.length ?? 0) > 1 ? "s" : ""}</Badge>
        </div>
      </div>

      {/* Membres */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
          Membres
        </h2>
        <div className="flex flex-col gap-2">
          {group?.members.map((member) => (
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
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bg-muted)" }}>
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

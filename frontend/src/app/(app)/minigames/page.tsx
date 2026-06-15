import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface MiniGame {
  id: string;
  emoji: string;
  title: string;
  description: string;
  accent: string;
  href: string | null;
  comingSoon?: boolean;
}

const MINI_GAMES: MiniGame[] = [
  {
    id: "name-that-tune",
    emoji: "🎸",
    title: "Name That Tune",
    description: "Écoute l'intro et sois le premier à trouver le titre. Rapidité et culture musicale au programme !",
    accent: "var(--pink)",
    href: "/blindtest",
  },
  {
    id: "quiz-musical",
    emoji: "🧠",
    title: "Quiz Musical",
    description: "Des questions sur les artistes, les albums et les hits. Qui est le meilleur connaisseur ?",
    accent: "var(--green)",
    href: null,
    comingSoon: false,
  },
  {
    id: "choregraphie",
    emoji: "💃",
    title: "Chorégraphie",
    description: "Suis le rythme et réalise les meilleures chorégraphies avec ta caméra !",
    accent: "var(--pink)",
    href: null,
    comingSoon: true,
  },
];

export default function MinigamesPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-light">Mini-jeux 🕹️</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--bg-muted)" }}>
          Des défis musicaux pour animer la soirée
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MINI_GAMES.map(({ id, emoji, title, description, accent, href, comingSoon }, idx) => (
          <div
            key={id}
            className="rounded-2xl p-5 border card-hover"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--bg-muted)",
              borderLeftWidth: "3px",
              borderLeftColor: accent,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">{emoji}</span>
              {comingSoon && <Badge variant="muted">Bientôt disponible</Badge>}
            </div>

            <h2
              className="text-lg font-black mb-2"
              style={{ color: idx % 2 === 0 ? "var(--pink)" : "var(--green)" }}
            >
              {title}
            </h2>

            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--bg-muted)" }}>
              {description}
            </p>

            {comingSoon ? (
              <Button variant="ghost" size="sm" disabled>
                Bientôt disponible
              </Button>
            ) : href ? (
              <Link href={href}>
                <Button variant={idx % 2 === 0 ? "primary" : "secondary"} size="sm">
                  Jouer
                </Button>
              </Link>
            ) : (
              <Button variant={idx % 2 === 0 ? "primary" : "secondary"} size="sm">
                Jouer
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import BottomNav from "@/components/BottomNav";

export default function GroupeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-deep)" }}>
      <div className="flex-1 pb-20">{children}</div>
      <BottomNav groupId={params.id} />
    </div>
  );
}

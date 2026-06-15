import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-deep)" }}>
        <TopBar />
        <main className="flex-1 pt-14 pb-20 overflow-y-auto">
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}

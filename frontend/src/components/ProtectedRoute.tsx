"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div
        className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
        style={{
          borderTopColor: "var(--pink)",
          borderRightColor: "var(--green)",
        }}
        aria-label="Chargement"
      />
    </div>
  );
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, user, isGuest } = useAuth();
  const router = useRouter();

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isGuest) {
      router.replace("/connexion");
    }
  }, [isLoading, isAuthenticated, isGuest, router]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated && !isGuest) {
    return <Spinner />;
  }

  return <>{children}</>;
}

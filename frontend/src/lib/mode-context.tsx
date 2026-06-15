"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type AppMode, getMode, setMode as persistMode } from "./mode";

interface ModeContextValue {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  isChild: boolean;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "adult",
  setMode: () => {},
  isChild: false,
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("adult");

  useEffect(() => {
    setModeState(getMode());
  }, []);

  function setMode(m: AppMode) {
    persistMode(m);
    setModeState(m);
  }

  return (
    <ModeContext.Provider value={{ mode, setMode, isChild: mode === "child" }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}

"use client";

import { createContext, useContext } from "react";

const HeaderModeContext = createContext(false);

type HeaderModeProviderProps = {
  children: React.ReactNode;
  /** Araç alt sayfalarında üst band (logo/slogan) kalıcı gizli — minimal header */
  minimal: boolean;
};

export function HeaderModeProvider({
  children,
  minimal,
}: HeaderModeProviderProps) {
  return (
    <HeaderModeContext.Provider value={minimal}>
      {children}
    </HeaderModeContext.Provider>
  );
}

export function useHeaderMinimal() {
  return useContext(HeaderModeContext);
}

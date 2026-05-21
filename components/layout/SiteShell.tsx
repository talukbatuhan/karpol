"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { isToolSubpagePath } from "@/lib/tools-path";
import {
  clearSiteHeaderHeight,
  setSiteHeaderHeight,
} from "@/lib/site-header-height";
import { HeaderModeProvider } from "@/components/layout/HeaderModeContext";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { PageTransition } from "@/components/motion/PageTransition";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isToolWorkspace = isToolSubpagePath(pathname);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (isToolWorkspace) {
      root.classList.add("tools-workspace");
      setSiteHeaderHeight(0);
      return () => {
        root.classList.remove("tools-workspace");
        clearSiteHeaderHeight();
        document.body.style.overflow = "";
      };
    }

    root.classList.remove("tools-workspace");
    clearSiteHeaderHeight();
    document.body.style.overflow = "";
  }, [isToolWorkspace]);

  return (
    <HeaderModeProvider minimal={false}>
      {!isToolWorkspace ? <Header /> : null}
      <main
        className={`flex min-h-0 flex-1 flex-col ${
          isToolWorkspace ? "overflow-hidden" : ""
        }`}
      >
        {isToolWorkspace ? (
          children
        ) : (
          <PageTransition>{children}</PageTransition>
        )}
      </main>
      {!isToolWorkspace ? <Footer /> : null}
    </HeaderModeProvider>
  );
}

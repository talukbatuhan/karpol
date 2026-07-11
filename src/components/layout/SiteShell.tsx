"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { isEcatalogReaderPath } from "@/lib/ecatalog-path";
import {
  clearSiteHeaderHeight,
  setSiteHeaderHeight,
} from "@/lib/site-header-height";
import { useMediaQuery } from "@/hooks/use-media-query";
import { HeaderModeProvider } from "@/components/layout/HeaderModeContext";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { PageTransition } from "@/components/motion/PageTransition";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const isEcatalogReaderMobile =
    isMobile && isEcatalogReaderPath(pathname);
  const hideChrome = isEcatalogReaderMobile;

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (isEcatalogReaderMobile) {
      root.classList.add("ecatalog-reader-fullscreen");
      setSiteHeaderHeight(0);
      return () => {
        root.classList.remove("ecatalog-reader-fullscreen");
        clearSiteHeaderHeight();
        document.body.style.overflow = "";
      };
    }

    root.classList.remove("ecatalog-reader-fullscreen");
    clearSiteHeaderHeight();
    document.body.style.overflow = "";
  }, [isEcatalogReaderMobile]);

  return (
    <HeaderModeProvider minimal={false}>
      {!hideChrome ? <Header /> : null}
      <main
        className={`flex min-h-0 flex-1 flex-col ${
          hideChrome ? "overflow-hidden" : ""
        }`}
      >
        {hideChrome ? children : <PageTransition>{children}</PageTransition>}
      </main>
      {!hideChrome ? <Footer /> : null}
    </HeaderModeProvider>
  );
}

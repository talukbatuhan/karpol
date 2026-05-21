"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { isToolSubpagePath } from "@/lib/tools-path";

type ToolsLayoutShellProps = {
  children: React.ReactNode;
};

/** Araç alt sayfaları: site navbar yok, tam ekran araç alanı (ToolChrome üst bar). */
export function ToolsLayoutShell({ children }: ToolsLayoutShellProps) {
  const pathname = usePathname();
  const isSubpage = isToolSubpagePath(pathname);

  useLayoutEffect(() => {
    if (!isSubpage) return;
    document.documentElement.dataset.toolLayout = "workspace";
    return () => {
      delete document.documentElement.dataset.toolLayout;
    };
  }, [isSubpage]);

  if (!isSubpage) {
    return (
      <div className="flex min-h-[520px] w-full flex-col">{children}</div>
    );
  }

  return (
    <div className="flex h-[100svh] max-h-[100svh] min-h-0 w-full flex-col overflow-hidden">
      {children}
    </div>
  );
}

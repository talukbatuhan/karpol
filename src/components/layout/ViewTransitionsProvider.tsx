"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

function isInternalNavigation(anchor: HTMLAnchorElement): boolean {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:")) return false;
  if (href.startsWith("tel:")) return false;
  if (href.startsWith("javascript:")) return false;

  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default function ViewTransitionsProvider() {
  const router = useRouter();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const doc = document as DocumentWithViewTransition;
    if (typeof doc.startViewTransition !== "function") return;

    const handler = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const path = event.composedPath();
      const anchor = path.find(
        (node): node is HTMLAnchorElement =>
          node instanceof HTMLAnchorElement && !!node.href,
      );
      if (!anchor) return;
      if (!isInternalNavigation(anchor)) return;

      const url = new URL(anchor.href, window.location.href);
      const dest = `${url.pathname}${url.search}${url.hash}`;

      event.preventDefault();
      event.stopPropagation();

      doc.startViewTransition!(() => {
        router.push(dest);
      });
    };

    document.addEventListener("click", handler, { capture: true });
    return () => {
      document.removeEventListener("click", handler, { capture: true });
    };
  }, [router]);

  return null;
}

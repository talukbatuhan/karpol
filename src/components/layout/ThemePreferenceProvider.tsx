"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ThemePreference = "auto" | "light" | "dark";
export type EffectiveTheme = "light" | "dark";

const STORAGE_KEY = "karpol:theme";
const EVENT = "karpol:theme-changed";
const ATTR = "data-user-theme";

function readStored(): ThemePreference {
  if (typeof window === "undefined") return "auto";
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "auto") return value;
  } catch {
    /* noop */
  }
  return "auto";
}

function applyAttribute(pref: ThemePreference) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (pref === "auto") {
    html.removeAttribute(ATTR);
  } else {
    html.setAttribute(ATTR, pref);
  }
}

function persist(pref: ThemePreference) {
  if (typeof window === "undefined") return;
  try {
    if (pref === "auto") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* noop */
  }
  applyAttribute(pref);
  window.dispatchEvent(new CustomEvent<ThemePreference>(EVENT, { detail: pref }));
}

interface UseThemePreferenceOptions {
  /**
   * The theme to use when preference === "auto". Each consumer decides
   * its own auto policy (e.g. light on /about, dark on /).
   */
  autoEffective: EffectiveTheme;
}

interface UseThemePreferenceReturn {
  preference: ThemePreference;
  effective: EffectiveTheme;
  setPreference: (next: ThemePreference) => void;
  cycle: () => void;
}

/**
 * Lightweight theme preference hook that does NOT require a React provider.
 * State is synchronized across all consumers via localStorage + a custom
 * window event, avoiding the SSR/RSC interleaving issues that come with
 * wrapping `children` in a client-only context provider.
 */
export function useThemePreference(
  options: UseThemePreferenceOptions = { autoEffective: "light" },
): UseThemePreferenceReturn {
  const { autoEffective } = options;
  const [preference, setPreferenceState] = useState<ThemePreference>("auto");
  const [hydrated, setHydrated] = useState(false);
  const prefRef = useRef<ThemePreference>("auto");

  useEffect(() => {
    prefRef.current = preference;
  }, [preference]);

  useEffect(() => {
    const stored = readStored();
    prefRef.current = stored;
    setPreferenceState(stored);
    applyAttribute(stored);
    setHydrated(true);

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<ThemePreference>).detail;
      if (detail !== "light" && detail !== "dark" && detail !== "auto") return;
      if (prefRef.current === detail) return;
      prefRef.current = detail;
      setPreferenceState(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next: ThemePreference =
        e.newValue === "light" || e.newValue === "dark" ? e.newValue : "auto";
      if (prefRef.current === next) return;
      prefRef.current = next;
      setPreferenceState(next);
      applyAttribute(next);
    };

    window.addEventListener(EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    if (prefRef.current === next) return;
    prefRef.current = next;
    setPreferenceState(next);
    persist(next);
  }, []);

  const cycle = useCallback(() => {
    const order: ThemePreference[] = ["auto", "light", "dark"];
    const current = prefRef.current;
    const next = order[(order.indexOf(current) + 1) % order.length];
    prefRef.current = next;
    setPreferenceState(next);
    persist(next);
  }, []);

  const effective: EffectiveTheme = !hydrated
    ? autoEffective
    : preference === "auto"
      ? autoEffective
      : preference;

  return { preference, effective, setPreference, cycle };
}

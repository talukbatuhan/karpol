"use client";

import { Sun, Moon, MonitorCog } from "lucide-react";
import {
  useThemePreference,
  type ThemePreference,
} from "./ThemePreferenceProvider";

const ICONS: Record<ThemePreference, React.ComponentType<{ size?: number }>> = {
  auto: MonitorCog,
  light: Sun,
  dark: Moon,
};

const LABELS: Record<ThemePreference, string> = {
  auto: "Otomatik tema (sayfaya göre)",
  light: "Aydınlık tema",
  dark: "Karanlık tema",
};

interface Props {
  className?: string;
}

export default function ThemeToggleButton({ className }: Props) {
  const { preference, cycle } = useThemePreference();
  const Icon = ICONS[preference];
  const documentWithVT = typeof document !== "undefined"
    ? (document as Document & {
        startViewTransition?: (cb: () => void) => unknown;
      })
    : null;

  const handleClick = () => {
    if (documentWithVT?.startViewTransition) {
      documentWithVT.startViewTransition(() => {
        cycle();
      });
      return;
    }
    cycle();
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-label={LABELS[preference]}
      title={LABELS[preference]}
      data-pref={preference}
    >
      <Icon size={14} />
    </button>
  );
}

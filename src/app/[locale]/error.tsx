"use client";

import { AppErrorScreen } from "@/components/organisms/AppErrorScreen";

export interface LocaleErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleErrorPage({ error, reset }: LocaleErrorPageProps) {
  return <AppErrorScreen error={error} reset={reset} />;
}

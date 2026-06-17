"use client";

import { AppErrorScreen } from "@/components/organisms/AppErrorScreen";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <AppErrorScreen error={error} reset={reset} />;
}

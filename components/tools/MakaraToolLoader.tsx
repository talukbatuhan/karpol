"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/tools/ToolSkeleton";
import type { MakaraToolLabels } from "@/components/tools/MakaraTool";

const MakaraTool = dynamic(
  () =>
    import("@/components/tools/MakaraTool").then((m) => ({
      default: m.MakaraTool,
    })),
  { ssr: false, loading: () => <ToolSkeleton /> },
);

export function MakaraToolLoader({ labels }: { labels: MakaraToolLabels }) {
  return <MakaraTool labels={labels} />;
}

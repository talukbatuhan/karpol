"use client";

import { QuoteListProvider } from "@/contexts/QuoteListContext";
import GlobalSiteActionBar from "@/components/layout/GlobalSiteActionBar";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QuoteListProvider>
      {children}
      <GlobalSiteActionBar />
    </QuoteListProvider>
  );
}

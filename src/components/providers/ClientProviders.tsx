'use client'

import { QuoteListProvider } from '@/contexts/QuoteListContext'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <QuoteListProvider>{children}</QuoteListProvider>
}

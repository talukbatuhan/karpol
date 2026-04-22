import { createBrowserClient } from '@supabase/ssr'

let browserClient: ReturnType<typeof createBrowserClient> | undefined

/**
 * Single browser Supabase client per tab to avoid extra GoTrue listeners
 * and duplicate realtime/auth state (Supabase + Next.js SSR guidance).
 */
export function createClient() {
  if (typeof window === 'undefined') {
    throw new Error('createClient from supabase-client must run in the browser')
  }
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return browserClient
}

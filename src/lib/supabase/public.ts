import { createClient } from "@supabase/supabase-js";

/** Anon client for public reads (no cookies — safe at build time). */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase public client is not configured");
  }
  return createClient(url, key);
}

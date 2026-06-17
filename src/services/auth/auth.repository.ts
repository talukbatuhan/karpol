import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type DbClient = SupabaseClient<Database>;

export async function signInWithEmail(
  supabase: DbClient,
  email: string,
  password: string,
) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOutUser(supabase: DbClient) {
  return supabase.auth.signOut();
}

export async function getCurrentUser(supabase: DbClient) {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getProfileRole(supabase: DbClient, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role ?? null;
}

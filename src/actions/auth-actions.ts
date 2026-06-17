"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getCurrentUser,
  getProfileRole,
  signInWithEmail,
  signOutUser,
} from "@/services/auth/auth.repository";

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }

  const supabase = await createClient();
  const { error } = await signInWithEmail(supabase, email, password);

  if (error) {
    return { error: error.message };
  }

  const user = await getCurrentUser(supabase);

  if (!user) {
    return { error: "Oturum açılamadı." };
  }

  const role = await getProfileRole(supabase, user.id);

  if (role !== "admin") {
    await signOutUser(supabase);
    return { error: "Bu hesap admin yetkisine sahip değil." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await signOutUser(supabase);
  redirect("/admin/login");
}

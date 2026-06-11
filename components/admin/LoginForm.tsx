"use client";

import { useActionState } from "react";
import { signInWithPassword } from "@/lib/actions/auth-actions";

type SignInState = { error?: string } | undefined;

async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  return signInWithPassword(formData);
}

export function LoginForm({ forbidden }: { forbidden?: boolean }) {
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <form action={formAction} className="w-full max-w-md space-y-6">
      {forbidden ? (
        <p className="rounded border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Bu hesap için admin yetkisi yok.
        </p>
      ) : null}
      {state?.error ? (
        <p className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
          E-posta
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full border border-navy-800/30 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
          Şifre
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full border border-navy-800/30 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full border border-gold-500 bg-gold-500 py-3 font-mono text-xs uppercase tracking-widest text-navy-950 disabled:opacity-50"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş"}
      </button>
    </form>
  );
}

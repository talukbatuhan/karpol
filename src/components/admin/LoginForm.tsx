"use client";

import { useActionState } from "react";
import { signInWithPassword } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";

type SignInState = { error?: string } | undefined;

export interface LoginFormProps {
  forbidden?: boolean;
}

async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  return signInWithPassword(formData);
}

export function LoginForm({ forbidden }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <form action={formAction} className="w-full max-w-md space-y-6">
      {forbidden ? (
        <p className="border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Bu hesap için admin yetkisi yok.
        </p>
      ) : null}
      {state?.error ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <FormField label="E-posta" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </FormField>
      <FormField label="Şifre" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </FormField>
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full font-mono text-xs uppercase tracking-widest"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş"}
      </Button>
    </form>
  );
}

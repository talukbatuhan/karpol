import { LoginForm } from "@/components/admin/LoginForm";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6">
      <div className="w-full max-w-md border border-navy-800 bg-ivory-50 p-10">
        <h1 className="font-display text-2xl font-bold text-navy-950">Karpol CMS</h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-navy-800/70">
          Admin girişi
        </p>
        <div className="mt-8">
          <LoginForm forbidden={error === "forbidden"} />
        </div>
      </div>
    </div>
  );
}

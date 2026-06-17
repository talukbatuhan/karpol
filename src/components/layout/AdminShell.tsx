import Link from "next/link";
import { signOut } from "@/actions/auth-actions";
import { AdminNav } from "@/components/admin/AdminNav";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
};

export function AdminShell({ children, userEmail }: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-ivory-50 text-navy-950">
      <aside className="flex w-56 shrink-0 flex-col border-r border-navy-800 bg-navy-950 text-ivory-50">
        <div className="border-b border-navy-800 px-5 py-6">
          <p className="font-display text-lg font-bold tracking-tight text-gold-500">
            Karpol CMS
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ivory-50/60">
            Admin
          </p>
        </div>
        <AdminNav />        <form action={signOut} className="border-t border-navy-800 p-3">
          <button
            type="submit"
            className="w-full rounded px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-ivory-50/60 transition-colors hover:bg-navy-800 hover:text-ivory-50"
          >
            Çıkış
          </button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-navy-800/20 bg-ivory-50 px-8 py-4">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800/70">
            İçerik yönetimi
          </span>
          {userEmail ? (
            <span className="font-mono text-xs text-navy-800">{userEmail}</span>
          ) : null}
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}

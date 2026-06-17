import { isContactEmailConfigured } from "@/lib/email/send-contact";

export function ContactSmtpDevNotice() {
  if (process.env.NODE_ENV !== "development") return null;
  if (isContactEmailConfigured()) return null;

  return (
    <p
      className="mb-4 border border-amber-500/40 bg-amber-50 px-4 py-3 font-mono text-xs text-amber-950"
      role="status"
    >
      Geliştirme: SMTP yapılandırılmadı. Form gönderimi çalışmaz —{" "}
      <code className="text-[11px]">docs/SMTP_SETUP.md</code>
    </p>
  );
}

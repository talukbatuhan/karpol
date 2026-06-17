import { Link } from "@/i18n/routing";

export interface SiteStatusScreenProps {
  code: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: "/" | "/contact" | "/products";
  loading?: boolean;
}

export function SiteStatusScreen({
  code,
  title,
  description,
  actionLabel,
  actionHref = "/",
  loading = false,
}: SiteStatusScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-ivory-50 px-6 py-20 md:py-28">
      <div className="w-full max-w-lg border border-navy-800 bg-ivory-100 p-10 md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
          {code}
        </p>
        <img
          src="/karpol-logo-nav.png"
          alt=""
          width={2025}
          height={510}
          className={`mx-auto mt-8 h-10 w-auto object-contain ${loading ? "animate-pulse" : ""}`}
        />
        <hr className="mx-auto mt-8 h-px w-16 border-0 bg-gold-500" />
        <h1 className="mt-8 text-center font-display text-2xl font-bold tracking-tight text-navy-950 md:text-3xl">
          {title}
        </h1>
        <p className="mt-4 text-center font-sans text-sm leading-relaxed text-navy-800/85 md:text-base">
          {description}
        </p>
        {loading ? (
          <div
            className="mx-auto mt-8 flex justify-center gap-1"
            role="status"
            aria-label={title}
          >
            <span className="h-1.5 w-8 animate-pulse bg-gold-500" />
            <span className="h-1.5 w-8 animate-pulse bg-gold-500 [animation-delay:150ms]" />
            <span className="h-1.5 w-8 animate-pulse bg-gold-500 [animation-delay:300ms]" />
          </div>
        ) : null}
        {!loading && actionLabel ? (
          <div className="mt-10 flex justify-center">
            <Link
              href={actionHref}
              className="border border-gold-500 bg-navy-950 px-8 py-3 font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950"
            >
              {actionLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

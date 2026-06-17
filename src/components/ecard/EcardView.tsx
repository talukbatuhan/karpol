import { BookOpen, Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { EcardProfile } from "@/lib/ecard/cards";
import type { VcardInput } from "@/lib/ecard/vcard";
import { EcardPortrait } from "@/components/ecard/EcardPortrait";
import { EcardQrCode } from "@/components/ecard/EcardQrCode";
import { EcardVcardButton } from "@/components/ecard/EcardVcardButton";

export type EcardLabels = {
  whatsapp: string;
  phone: string;
  email: string;
  website: string;
  catalog: string;
  directions: string;
  vcard: string;
  qrLabel: string;
  qrHint: string;
  socialTitle: string;
};

type EcardViewProps = {
  profile: EcardProfile;
  labels: EcardLabels;
  pageUrl: string;
};

const actionBase =
  "group flex w-full items-center justify-center gap-3 px-5 py-4 font-sans text-sm font-semibold transition-all duration-200";

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z"
      />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z"
      />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"
      />
    </svg>
  );
}

export function EcardView({ profile, labels, pageUrl }: EcardViewProps) {
  const vcardInput: VcardInput = {
    name: profile.name,
    title: `${profile.title} / ${profile.company}`,
    organization: profile.company,
    phone: profile.phoneDisplay,
    email: profile.email,
    url: profile.website,
    address: {
      street: profile.address.line1,
      city: "Denizli",
      region: "Merkezefendi",
      country: "Türkiye",
    },
  };

  const socialItems = [
    profile.social.youtube && {
      href: profile.social.youtube,
      label: "YouTube",
      icon: IconYoutube,
    },
    profile.social.instagram && {
      href: profile.social.instagram,
      label: "Instagram",
      icon: IconInstagram,
    },
    profile.social.linkedin && {
      href: profile.social.linkedin,
      label: "LinkedIn",
      icon: IconLinkedIn,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof IconYoutube;
  }>;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <article className="overflow-hidden border border-gold-500/30 bg-ivory-50 shadow-[0_24px_64px_rgba(6,14,26,0.45)]">
          <header className="relative bg-navy-950 px-6 pb-16 pt-10 text-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, transparent 40%, #C9A227 40%, #C9A227 42%, transparent 42%)",
              }}
              aria-hidden
            />
            <div className="relative -mb-12">
              <EcardPortrait
                name={profile.name}
                photoSrc={profile.photoSrc}
                photoAlt={profile.photoAlt}
              />
            </div>
          </header>

          <div className="px-6 pb-8 pt-14 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-500">
              {profile.company}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-950">
              {profile.name}
            </h1>
            <p className="mt-1 font-sans text-base text-navy-800/85">
              {profile.title}
            </p>
          </div>

          <div className="space-y-3 px-6 pb-6">
            <a
              href={profile.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionBase} bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:bg-[#1ebe5d] hover:shadow-[0_6px_28px_rgba(37,211,102,0.45)]`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 fill-current"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {labels.whatsapp}
            </a>

            <a
              href={profile.phoneHref}
              className={`${actionBase} border-2 border-navy-950 bg-navy-950 text-ivory-50 hover:border-gold-500 hover:bg-gold-500 hover:text-navy-950`}
            >
              <Phone
                className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110"
                aria-hidden
              />
              {labels.phone}
            </a>

            <a
              href={`mailto:${profile.email}`}
              className={`${actionBase} border-2 border-navy-950/20 bg-ivory-100 text-navy-950 hover:border-gold-500 hover:bg-gold-500/10`}
            >
              <Mail
                className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110"
                aria-hidden
              />
              {labels.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 px-6 pb-6">
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionBase} border border-navy-950/15 bg-white text-navy-950 hover:border-gold-500 hover:bg-navy-950 hover:text-ivory-50`}
            >
              <Globe className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{labels.website}</span>
            </a>

            <Link
              href={profile.catalogPath}
              className={`${actionBase} border border-navy-950/15 bg-white text-navy-950 hover:border-gold-500 hover:bg-navy-950 hover:text-ivory-50`}
            >
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{labels.catalog}</span>
            </Link>
          </div>

          {socialItems.length > 0 ? (
            <div className="px-6 pb-6">
              <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-navy-800/60">
                {labels.socialTitle}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {socialItems.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-12 w-12 items-center justify-center border-2 border-navy-950/15 bg-white text-navy-950 transition-colors hover:border-gold-500 hover:bg-navy-950 hover:text-gold-500"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="px-6 pb-6">
            <a
              href={profile.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionBase} border border-navy-950/15 bg-ivory-100 text-navy-950 hover:border-gold-500 hover:bg-navy-950 hover:text-ivory-50`}
            >
              <MapPin
                className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110"
                aria-hidden
              />
              <span className="text-left">
                <span className="block font-semibold">{labels.directions}</span>
                <span className="mt-0.5 block text-xs font-normal text-navy-800/75 group-hover:text-ivory-50/80">
                  {profile.address.line2}
                </span>
              </span>
            </a>
          </div>

          <div className="px-6 pb-8">
            <EcardVcardButton
              vcard={vcardInput}
              filename={profile.slug}
              label={labels.vcard}
            />
          </div>

          <div className="border-t border-navy-950/10 bg-ivory-100/60 px-6 py-8">
            <EcardQrCode
              url={pageUrl}
              label={labels.qrLabel}
              hint={labels.qrHint}
            />
          </div>

          <footer className="flex items-center justify-center gap-2 border-t border-gold-500/20 bg-navy-950 px-6 py-4">
            <Image
              src="/karpol-logo-nav.png"
              alt="Karpol Poliüretan"
              width={120}
              height={32}
              className="h-7 w-auto brightness-0 invert opacity-90"
            />
          </footer>
        </article>
      </div>
    </div>
  );
}

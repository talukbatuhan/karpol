type SocialLinkProps = {
  href: string;
  label: string;
  children: React.ReactNode;
  variant?: "light" | "nav";
};

const variantClass = {
  light:
    "border-navy-800/40 text-navy-800 hover:border-gold-500 hover:text-gold-500",
  nav: "border-gold-500/50 text-ivory-100 hover:border-gold-500 hover:text-gold-300",
};

export function SocialLink({
  href,
  label,
  children,
  variant = "light",
}: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center border transition-colors ${variantClass[variant]}`}
    >
      {children}
    </a>
  );
}

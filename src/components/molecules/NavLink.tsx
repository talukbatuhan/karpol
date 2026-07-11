"use client";

import { motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import { navUnderline } from "@/lib/motion/variants";

type NavLinkProps = {
  href: "/" | "/hakkimizda" | "/urunler" | "/iletisim";
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <motion.div
      className="relative"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <Link
        href={href}
        className={`font-sans text-sm font-medium uppercase tracking-wider transition-colors ${
          isActive ? "text-gold-500" : "text-ivory-100 hover:text-gold-300"
        }`}
      >
        {label}
      </Link>
      <motion.span
        variants={navUnderline}
        className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gold-500"
        aria-hidden
      />
    </motion.div>
  );
}

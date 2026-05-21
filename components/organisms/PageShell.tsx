import type { ReactNode } from "react";

export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16 ${className}`}
    >
      <div className="grid grid-cols-12 gap-6 md:gap-8">{children}</div>
    </div>
  );
}

type Props = {
  children: React.ReactNode;
};

/** Site header (--site-header-height) altında tam yükseklik araç alanı */
export default function ToolsLayout({ children }: Props) {
  return (
    <div className="flex h-[calc(100svh-var(--site-header-height))] min-h-[520px] w-full flex-col">
      {children}
    </div>
  );
}

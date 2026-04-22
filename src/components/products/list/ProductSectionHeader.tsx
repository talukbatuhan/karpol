"use client";

type ProductSectionHeaderProps = {
  title: string;
  count: number;
  accent?: string;
};

export default function ProductSectionHeader({
  title,
  count,
  accent = "rgba(200, 168, 90, 0.65)",
}: ProductSectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
        marginBottom: "1.1rem",
        marginTop: "2rem",
        paddingBottom: "0.65rem",
        borderBottom: `2px solid ${accent}`,
      }}
    >
      <h3
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 400,
          fontSize: "1.35rem",
          margin: 0,
          color: "rgba(15, 23, 41, 0.96)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <span
        style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(100, 116, 139, 0.88)",
        }}
      >
        {count}
      </span>
    </div>
  );
}

export type ToolKind = "react" | "legacy-html";

export type ToolId =
  | "makara"
  | "kaucuk-titresim-takozlari"
  | "silim-lastigi";

export type ToolEntry = {
  id: ToolId;
  href: `/tools/${ToolId}`;
  kind: ToolKind;
  messageKey: string;
  /** Yalnızca legacy-html araçlar için — public/ altındaki yol */
  legacySrc?: string;
};

export const tools: ToolEntry[] = [
  {
    id: "makara",
    href: "/tools/makara",
    kind: "react",
    messageKey: "makara",
  },
  {
    id: "kaucuk-titresim-takozlari",
    href: "/tools/kaucuk-titresim-takozlari",
    kind: "legacy-html",
    messageKey: "kaucukTitresim",
    legacySrc: "/legacy/kaucuk-titresim-takozlari.html",
  },
  {
    id: "silim-lastigi",
    href: "/tools/silim-lastigi",
    kind: "legacy-html",
    messageKey: "silimLastigi",
    legacySrc: "/legacy/silim-lastigi.html",
  },
];

export function getTool(id: string): ToolEntry | undefined {
  return tools.find((t) => t.id === id);
}

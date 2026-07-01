export type ToolKind = "react" | "legacy-html" | "design-module";

export type ToolId =
  | "makara"
  | "kaucuk-titresim-takozlari"
  | "silim-lastigi"
  | "rubber-bellows"
  | "o-ring"
  | "rubber-profile"
  | "extrusion"
  | "seal"
  | "roller"
  | "conveyor-component"
  | "mold-design";

export type ToolEntry = {
  id: ToolId;
  href: `/tools/${ToolId}`;
  kind: ToolKind;
  messageKey: string;
  /** design-module araçlar için parametric engine modül kimliği */
  moduleId?: string;
  /** Yalnızca legacy-html araçlar için — public/ altındaki yol */
  legacySrc?: string;
  /** Planlanan modüller hub'da gösterilir ama açılamaz */
  planned?: boolean;
};

export const tools: ToolEntry[] = [
  {
    id: "rubber-bellows",
    href: "/tools/rubber-bellows",
    kind: "design-module",
    messageKey: "rubberBellows",
    moduleId: "rubber-bellows",
  },
  {
    id: "makara",
    href: "/tools/makara",
    kind: "react",
    messageKey: "makara",
  },
  {
    id: "kaucuk-titresim-takozlari",
    href: "/tools/kaucuk-titresim-takozlari",
    kind: "design-module",
    messageKey: "kaucukTitresim",
    moduleId: "vibration-damper",
  },
  {
    id: "silim-lastigi",
    href: "/tools/silim-lastigi",
    kind: "design-module",
    messageKey: "silimLastigi",
    moduleId: "grinding-rubber",
  },
  {
    id: "o-ring",
    href: "/tools/o-ring",
    kind: "design-module",
    messageKey: "oRing",
    moduleId: "o-ring",
    planned: true,
  },
  {
    id: "rubber-profile",
    href: "/tools/rubber-profile",
    kind: "design-module",
    messageKey: "rubberProfile",
    moduleId: "rubber-profile",
    planned: true,
  },
  {
    id: "extrusion",
    href: "/tools/extrusion",
    kind: "design-module",
    messageKey: "extrusion",
    moduleId: "extrusion",
    planned: true,
  },
  {
    id: "seal",
    href: "/tools/seal",
    kind: "design-module",
    messageKey: "seal",
    moduleId: "seal",
    planned: true,
  },
  {
    id: "roller",
    href: "/tools/roller",
    kind: "design-module",
    messageKey: "roller",
    moduleId: "roller",
    planned: true,
  },
  {
    id: "conveyor-component",
    href: "/tools/conveyor-component",
    kind: "design-module",
    messageKey: "conveyorComponent",
    moduleId: "conveyor-component",
    planned: true,
  },
  {
    id: "mold-design",
    href: "/tools/mold-design",
    kind: "design-module",
    messageKey: "moldDesign",
    moduleId: "mold-design",
    planned: true,
  },
];

export function getTool(id: string): ToolEntry | undefined {
  return tools.find((t) => t.id === id);
}

export const activeTools = tools.filter((t) => !t.planned);

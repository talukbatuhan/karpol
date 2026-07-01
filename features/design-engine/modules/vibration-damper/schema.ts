import type { ParameterSchema } from "../../core/types";

export type DamperProfileType = "bog" | "sil" | "konik" | "kanalliC";
export type ThreadEndType = "M" | "F" | "T";

export type DamperTypeKey =
  | "tipAT"
  | "tipBT"
  | "tipCT"
  | "tipA"
  | "tipB"
  | "tipC"
  | "tipD"
  | "tipE"
  | "tipK"
  | "tipYeni2";

export type DamperTypeConfig = {
  profile: DamperProfileType;
  topThread: ThreadEndType;
  bottomThread: ThreadEndType;
  plateMm: number;
};

export const DAMPER_TYPE_CONFIG: Record<DamperTypeKey, DamperTypeConfig> = {
  tipAT: { profile: "bog", topThread: "M", bottomThread: "M", plateMm: 3 },
  tipBT: { profile: "bog", topThread: "M", bottomThread: "F", plateMm: 3 },
  tipCT: { profile: "bog", topThread: "F", bottomThread: "F", plateMm: 3 },
  tipA: { profile: "sil", topThread: "M", bottomThread: "M", plateMm: 3 },
  tipB: { profile: "sil", topThread: "M", bottomThread: "F", plateMm: 3 },
  tipC: { profile: "sil", topThread: "F", bottomThread: "F", plateMm: 3 },
  tipD: { profile: "sil", topThread: "M", bottomThread: "T", plateMm: 3 },
  tipE: { profile: "sil", topThread: "F", bottomThread: "T", plateMm: 3 },
  tipK: { profile: "konik", topThread: "M", bottomThread: "T", plateMm: 3 },
  tipYeni2: { profile: "kanalliC", topThread: "F", bottomThread: "F", plateMm: 4 },
};

export type VibrationDamperPrimary = {
  damperType: DamperTypeKey;
  disCap: number;
  kucukCap: number;
  kaucukBoyu: number;
  sertlik: number;
  vidaTipi: string;
  vidaUzunluk: number;
  disiDerinlik: number;
};

export type VibrationDamperDerived = {
  typeConfig: DamperTypeConfig;
  threadWidth: number;
  plateThickness: number;
  rubberHalfHeight: number;
  grooveParams?: ReturnType<typeof kanalliParams>;
};

export function kanalliParams(w: number, h: number) {
  const outerR = Math.min(w * 0.05, 6);
  const gW = w * 0.22;
  const gH = h * 0.82;
  const gR = Math.min(gW * 0.14, 2.2);
  return { outerR, gW, gH, gR, lcx_off: w * 0.23, rcx_off: w * 0.77 };
}

export const vibrationDamperDefaults: VibrationDamperPrimary = {
  damperType: "tipAT",
  disCap: 40,
  kucukCap: 25,
  kaucukBoyu: 30,
  sertlik: 60,
  vidaTipi: "M8",
  vidaUzunluk: 23,
  disiDerinlik: 10,
};

export const vibrationDamperSchema: ParameterSchema<VibrationDamperPrimary> = {
  moduleId: "vibration-damper",
  defaults: vibrationDamperDefaults,
  parameters: [
    {
      id: "damperType",
      labelKey: "damperType",
      role: "primary",
      type: "enum",
      defaultValue: "tipAT",
      group: "type",
      options: Object.keys(DAMPER_TYPE_CONFIG).map((value) => ({
        value,
        labelKey: value,
      })),
    },
    { id: "disCap", labelKey: "disCap", role: "primary", type: "number", unit: "mm", min: 10, max: 200, step: 0.5, defaultValue: 40, group: "rubber" },
    {
      id: "kucukCap",
      labelKey: "kucukCap",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 5,
      max: 180,
      step: 0.5,
      defaultValue: 25,
      group: "rubber",
      visibleWhen: (p) => {
        const cfg = DAMPER_TYPE_CONFIG[p.damperType as DamperTypeKey];
        return cfg?.profile === "bog";
      },
    },
    { id: "kaucukBoyu", labelKey: "kaucukBoyu", role: "primary", type: "number", unit: "mm", min: 5, max: 200, step: 0.5, defaultValue: 30, group: "rubber" },
    { id: "sertlik", labelKey: "sertlik", role: "primary", type: "number", unit: "shore", min: 30, max: 90, step: 1, defaultValue: 60, group: "rubber" },
    { id: "vidaTipi", labelKey: "vidaTipi", role: "primary", type: "enum", defaultValue: "M8", group: "thread", options: ["M6", "M8", "M10", "M12"].map((v) => ({ value: v, labelKey: v })) },
    {
      id: "vidaUzunluk",
      labelKey: "vidaUzunluk",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 5,
      max: 100,
      step: 0.5,
      defaultValue: 23,
      group: "thread",
      visibleWhen: (p) => {
        const cfg = DAMPER_TYPE_CONFIG[p.damperType as DamperTypeKey];
        return cfg?.topThread === "M" || cfg?.bottomThread === "M";
      },
    },
    {
      id: "disiDerinlik",
      labelKey: "disiDerinlik",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 3,
      max: 50,
      step: 0.5,
      defaultValue: 10,
      group: "thread",
      visibleWhen: (p) => {
        const cfg = DAMPER_TYPE_CONFIG[p.damperType as DamperTypeKey];
        return cfg?.topThread === "F" || cfg?.bottomThread === "F";
      },
    },
  ],
};

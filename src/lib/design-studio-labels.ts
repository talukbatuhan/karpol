import type { DesignModule } from "@/features/design-engine/core/types";
import type { DesignStudioLabels } from "@/components/design-studio/DesignStudioShell";

type Translator = ((key: string) => string) & {
  has?: (key: string) => boolean;
};

function translateIfPresent(t: Translator, key: string): string | undefined {
  if (t.has && !t.has(key)) return undefined;
  return t(key);
}

export function buildDesignStudioLabels(
  t: Translator,
  tParams: Translator,
  tDerived: Translator,
  tGroups: Translator,
  tErrors: Translator,
  tExport: Translator,
  module: DesignModule,
): DesignStudioLabels {
  const params: Record<string, string> = {};
  for (const p of module.schema.parameters) {
    params[p.labelKey] =
      translateIfPresent(tParams, p.labelKey) ?? p.labelKey;
  }

  const derived: Record<string, string> = {};
  const derivedDefs = module.getDerivedParamDefs(
    module.computeDerived(module.schema.defaults as Record<string, unknown>),
  );
  for (const d of derivedDefs) {
    derived[d.id] = translateIfPresent(tDerived, d.id) ?? d.id;
  }

  const groups: Record<string, string> = {};
  const groupKeys = [
    ...new Set(module.schema.parameters.map((p) => p.group ?? "general")),
  ];
  for (const key of groupKeys) {
    groups[key] = translateIfPresent(tGroups, key) ?? key;
  }

  const errors: Record<string, string> = {};
  const errorKeys = [
    "convSectionNegative",
    "convOdMin",
    "convCount",
    "pitchZero",
    "icGeDis",
    "merkezGeDis",
    "merkezLeIc",
    "delikTooLarge",
    "dimsPositive",
    "kucukGeDis",
  ];
  for (const key of errorKeys) {
    const label = translateIfPresent(tErrors, key);
    if (label) errors[`errors.${key}`] = label;
  }

  return {
    panelTitle: t("panelTitle"),
    derivedTitle: t("derivedTitle"),
    view2d: t("view2d"),
    view3d: t("view3d"),
    params,
    derived,
    groups,
    errors,
    export: {
      exportPng: tExport("png"),
      exportPdf: tExport("pdf"),
      exportStep: tExport("step"),
      exportDxf: tExport("dxf"),
      exportBlocked: tExport("blocked"),
    },
    workerError: t("workerError"),
  };
}

import type { DesignModule, ValidationIssue } from "../../core/types";
import { computeVibrationDamperDerived } from "./compute";
import {
  buildVibrationDamperProfiles,
  buildVibrationDamperSolidSpec,
} from "./profiles";
import {
  vibrationDamperDefaults,
  vibrationDamperSchema,
  type VibrationDamperDerived,
  type VibrationDamperPrimary,
} from "./schema";

export const vibrationDamperModule: DesignModule<
  VibrationDamperPrimary,
  VibrationDamperDerived
> = {
  id: "vibration-damper",
  status: "active",
  schema: vibrationDamperSchema,
  computeDerived: computeVibrationDamperDerived,
  validate(primary, derived) {
    const issues: ValidationIssue[] = [];
    if (primary.disCap <= 0 || primary.kaucukBoyu <= 0) {
      issues.push({ code: "dims_positive", messageKey: "errors.dimsPositive" });
    }
    if (derived.typeConfig.profile === "bog" && primary.kucukCap >= primary.disCap) {
      issues.push({ paramId: "kucukCap", code: "kucuk_ge_dis", messageKey: "errors.kucukGeDis" });
    }
    return issues;
  },
  buildProfiles: buildVibrationDamperProfiles,
  buildSolidSpec: buildVibrationDamperSolidSpec,
  getDerivedParamDefs(derived) {
    return [
      { id: "threadWidth", value: derived.threadWidth },
      { id: "plateThickness", value: derived.plateThickness },
    ];
  },
};

export { vibrationDamperDefaults };

import type { ProfilePoint } from "../../geometry/profile2d";
import {
  DAMPER_TYPE_CONFIG,
  kanalliParams,
  type VibrationDamperDerived,
  type VibrationDamperPrimary,
} from "./schema";

export function computeVibrationDamperDerived(
  primary: VibrationDamperPrimary,
): VibrationDamperDerived {
  const typeConfig = DAMPER_TYPE_CONFIG[primary.damperType];
  const threadWidth = parseInt(primary.vidaTipi.replace("M", ""), 10) || 8;
  return {
    typeConfig,
    threadWidth,
    plateThickness: typeConfig.plateMm,
    rubberHalfHeight: primary.kaucukBoyu / 2,
    grooveParams:
      typeConfig.profile === "kanalliC"
        ? kanalliParams(primary.disCap, typeConfig.plateMm)
        : undefined,
  };
}

/** Half-section profile for revolve (x = radius, y = axial from center) */
export function buildDamperRubberProfile(
  primary: VibrationDamperPrimary,
  derived: VibrationDamperDerived,
): ProfilePoint[] {
  const D = primary.disCap;
  const d = primary.kucukCap;
  const k = primary.kaucukBoyu;
  const plateT = derived.plateThickness;
  const cnf = derived.typeConfig;
  const halfK = k / 2;

  const pts: ProfilePoint[] = [];

  if (cnf.profile === "sil") {
    pts.push({ x: 0, y: -halfK + plateT });
    pts.push({ x: D / 2, y: -halfK + plateT });
    if (cnf.bottomThread === "T") {
      pts.push({ x: D / 2, y: halfK });
      pts.push({ x: 0, y: halfK });
    } else {
      pts.push({ x: D / 2, y: halfK - plateT });
      pts.push({ x: 0, y: halfK - plateT });
    }
    pts.push({ x: 0, y: -halfK + plateT });
  } else if (cnf.profile === "bog") {
    pts.push({ x: 0, y: -halfK + plateT });
    pts.push({ x: D / 2, y: -halfK + plateT });
    pts.push({ x: d / 2, y: 0 });
    pts.push({ x: D / 2, y: halfK - plateT });
    pts.push({ x: 0, y: halfK - plateT });
    pts.push({ x: 0, y: -halfK + plateT });
  } else if (cnf.profile === "konik") {
    const bW = D * 0.92;
    pts.push({ x: 0, y: -halfK + plateT });
    pts.push({ x: D / 2, y: -halfK + plateT });
    pts.push({ x: bW / 2, y: halfK - plateT });
    pts.push({ x: 0, y: halfK - plateT });
    pts.push({ x: 0, y: -halfK + plateT });
  } else {
    pts.push({ x: 0, y: -halfK });
    pts.push({ x: D / 2, y: -halfK });
    pts.push({ x: D / 2, y: halfK });
    pts.push({ x: 0, y: halfK });
    pts.push({ x: 0, y: -halfK });
  }

  return pts;
}

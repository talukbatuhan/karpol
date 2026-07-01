import type { DrawingView, DimensionAnnotation } from "../../core/types";
import type { Profile2D } from "../../geometry/profile2d";
import { viewsBounds } from "../../geometry/profile2d";
import type { SolidSpec } from "../../geometry/solid-spec";
import { buildDamperRubberProfile } from "./compute";
import type { VibrationDamperDerived, VibrationDamperPrimary } from "./schema";

export function buildVibrationDamperProfiles(
  primary: VibrationDamperPrimary,
  derived: VibrationDamperDerived,
): DrawingView[] {
  const rubberPts = buildDamperRubberProfile(primary, derived);
  const offsetX = 0;
  const offsetY = 0;

  const sectionProfile: Profile2D = {
    id: "section",
    closed: true,
    points: [{ x: offsetX + rubberPts[0].x, y: offsetY + rubberPts[0].y }],
    segments: rubberPts.slice(1).map((to) => ({
      kind: "line" as const,
      to: { x: offsetX + to.x, y: offsetY + to.y },
    })),
    fill: "rgba(42, 47, 56, 0.9)",
    stroke: "#141820",
    lineWidth: 1.35,
    layer: "rubber",
  };

  const centerline: Profile2D = {
    id: "axis",
    closed: false,
    points: [{ x: offsetX - 5, y: offsetY }],
    segments: [{ kind: "line", to: { x: offsetX - 5, y: offsetY + primary.kaucukBoyu } }],
    stroke: "rgba(8, 145, 178, 0.35)",
    lineWidth: 0.75,
    layer: "centerline",
  };

  const profiles = [sectionProfile, centerline];
  const bounds = viewsBounds(profiles);

  const annotations: DimensionAnnotation[] = [
    {
      id: "disCap",
      value: primary.disCap,
      from: { x: 0, y: -primary.kaucukBoyu / 2 - 8 },
      to: { x: primary.disCap / 2, y: -primary.kaucukBoyu / 2 - 8 },
      offset: { x: 0, y: -10 },
      orientation: "horizontal",
    },
    {
      id: "kaucukBoyu",
      value: primary.kaucukBoyu,
      from: { x: primary.disCap / 2 + 12, y: -primary.kaucukBoyu / 2 },
      to: { x: primary.disCap / 2 + 12, y: primary.kaucukBoyu / 2 },
      offset: { x: 14, y: 0 },
      orientation: "vertical",
    },
  ];

  return [
    {
      id: "section",
      titleKey: "section",
      profiles,
      annotations,
      bounds,
    },
  ];
}

export function buildVibrationDamperSolidSpec(
  primary: VibrationDamperPrimary,
  derived: VibrationDamperDerived,
): SolidSpec {
  const profile = buildDamperRubberProfile(primary, derived).map((p) => ({
    x: p.y,
    y: p.x,
  }));
  return {
    kind: "revolve",
    profile,
    axis: "x",
    angle: 360,
  };
}

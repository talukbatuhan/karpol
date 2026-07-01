import type { DrawingView, DimensionAnnotation } from "../../core/types";
import type { Profile2D } from "../../geometry/profile2d";
import { offsetProfile, viewsBounds } from "../../geometry/profile2d";
import type { SolidSpec } from "../../geometry/solid-spec";
import type { RubberBellowsDerived, RubberBellowsPrimary } from "./schema";
import { buildWallProfilePoints } from "./compute";

function buildSideElevationProfile(
  primary: RubberBellowsPrimary,
  derived: RubberBellowsDerived,
): Profile2D {
  const {
    cuffLengthLeft,
    cuffLengthRight,
    totalLength,
    convolutionCount,
  } = primary;
  const {
    cuffOdLeft,
    cuffOdRight,
    convSectionLength,
    pitch,
    outerRadiusPeak,
    innerRadiusValley,
  } = derived;

  const cuffRLeft = cuffOdLeft / 2;
  const cuffRRight = cuffOdRight / 2;
  const convStart = cuffLengthLeft;
  const convEnd = cuffLengthLeft + convSectionLength;

  const pts: { x: number; y: number }[] = [];

  // Top outline (outer contour)
  pts.push({ x: 0, y: cuffRLeft });
  pts.push({ x: convStart, y: cuffRLeft });

  let x = convStart;
  for (let i = 0; i < convolutionCount; i++) {
    pts.push({ x: x + pitch / 2, y: innerRadiusValley });
    pts.push({ x: x + pitch, y: outerRadiusPeak });
    x += pitch;
  }

  pts.push({ x: convEnd, y: cuffRRight });
  pts.push({ x: totalLength, y: cuffRRight });

  // Bottom outline (mirror)
  pts.push({ x: totalLength, y: -cuffRRight });
  pts.push({ x: convEnd, y: -cuffRRight });

  x = convEnd;
  for (let i = convolutionCount - 1; i >= 0; i--) {
    const peakX = convStart + (i + 1) * pitch;
    const valleyX = convStart + (i + 0.5) * pitch;
    pts.push({ x: peakX, y: -outerRadiusPeak });
    pts.push({ x: valleyX, y: -innerRadiusValley });
  }

  pts.push({ x: convStart, y: -cuffRLeft });
  pts.push({ x: 0, y: -cuffRLeft });

  return {
    id: "side-elevation",
    closed: true,
    points: [pts[0]],
    segments: pts.slice(1).map((to) => ({ kind: "line" as const, to })),
    fill: "rgba(42, 47, 56, 0.12)",
    stroke: "#334155",
    lineWidth: 1.2,
    layer: "rubber",
  };
}

export function buildRubberBellowsProfiles(
  primary: RubberBellowsPrimary,
  derived: RubberBellowsDerived,
): DrawingView[] {
  const wallPts = buildWallProfilePoints(primary, derived);

  const sectionProfile: Profile2D = {
    id: "section-aa",
    closed: true,
    points: [wallPts[0]],
    segments: wallPts.slice(1).map((to) => ({ kind: "line" as const, to })),
    fill: "rgba(42, 47, 56, 0.85)",
    stroke: "#141820",
    lineWidth: 1.35,
    layer: "rubber",
  };

  const sectionAxis: Profile2D = {
    id: "section-axis",
    closed: false,
    points: [{ x: -4, y: 0 }],
    segments: [{ kind: "line", to: { x: primary.totalLength + 4, y: 0 } }],
    stroke: "rgba(8, 145, 178, 0.45)",
    lineWidth: 0.75,
    layer: "centerline",
  };

  const sideProfile = buildSideElevationProfile(primary, derived);
  const sideGap = 48;
  const sideOffsetX = primary.totalLength + sideGap;
  const sideShifted = offsetProfile(sideProfile, sideOffsetX, 0);

  const sideAxis: Profile2D = {
    id: "side-axis",
    closed: false,
    points: [{ x: sideOffsetX - 4, y: 0 }],
    segments: [
      { kind: "line", to: { x: sideOffsetX + primary.totalLength + 4, y: 0 } },
    ],
    stroke: "rgba(8, 145, 178, 0.45)",
    lineWidth: 0.75,
    layer: "centerline",
  };

  const profiles = [sectionProfile, sectionAxis, sideShifted, sideAxis];
  const bounds = viewsBounds([sectionProfile, sideShifted]);

  const annotations: DimensionAnnotation[] = [
    {
      id: "totalLength",
      value: primary.totalLength,
      from: { x: 0, y: -derived.outerRadiusPeak - 6 },
      to: { x: primary.totalLength, y: -derived.outerRadiusPeak - 6 },
      offset: { x: 0, y: -14 },
      orientation: "horizontal",
    },
    {
      id: "convOdMax",
      value: primary.convOdMax,
      from: {
        x: primary.cuffLengthLeft + derived.pitch / 2,
        y: derived.innerRadiusValley,
      },
      to: {
        x: primary.cuffLengthLeft + derived.pitch / 2,
        y: derived.outerRadiusPeak,
      },
      offset: { x: 16, y: 0 },
      orientation: "vertical",
    },
    {
      id: "cuffIdLeft",
      value: primary.cuffIdLeft,
      from: { x: 1.5, y: derived.innerRadiusLeft },
      to: { x: 1.5, y: derived.cuffOdLeft / 2 },
      offset: { x: -12, y: 0 },
      orientation: "vertical",
    },
    {
      id: "sideTotalLength",
      value: primary.totalLength,
      from: {
        x: sideOffsetX,
        y: -derived.outerRadiusPeak - 6,
      },
      to: {
        x: sideOffsetX + primary.totalLength,
        y: -derived.outerRadiusPeak - 6,
      },
      offset: { x: 0, y: -14 },
      orientation: "horizontal",
    },
  ];

  return [
    {
      id: "section-aa",
      titleKey: "sectionAA",
      profiles,
      annotations,
      bounds,
      regionLabels: [
        {
          label: "A–A",
          x: primary.totalLength / 2,
          y: -derived.outerRadiusPeak - 22,
        },
        {
          label: "Side",
          x: sideOffsetX + primary.totalLength / 2,
          y: -derived.outerRadiusPeak - 22,
        },
      ],
    },
  ];
}

export function buildRubberBellowsSolidSpec(
  primary: RubberBellowsPrimary,
  derived: RubberBellowsDerived,
): SolidSpec {
  const profile = buildWallProfilePoints(primary, derived);
  return {
    kind: "revolve",
    profile,
    axis: "x",
    angle: 360,
  };
}

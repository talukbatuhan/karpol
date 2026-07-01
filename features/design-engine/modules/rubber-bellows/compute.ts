import type { RubberBellowsDerived, RubberBellowsPrimary } from "./schema";

export function computeRubberBellowsDerived(
  primary: RubberBellowsPrimary,
): RubberBellowsDerived {
  const innerRadiusLeft = primary.cuffIdLeft / 2;
  const innerRadiusRight = primary.cuffIdRight / 2;
  const cuffOdLeft = primary.cuffIdLeft + 2 * primary.wallThickness;
  const cuffOdRight = primary.cuffIdRight + 2 * primary.wallThickness;
  const convSectionLength =
    primary.totalLength - primary.cuffLengthLeft - primary.cuffLengthRight;
  const pitch = convSectionLength / primary.convolutionCount;

  const outerRadiusPeak = primary.convOdMax / 2;
  const innerRadiusValley = primary.convIdMin / 2;
  const amplitude = outerRadiusPeak - innerRadiusValley;

  const peakRadius = Math.min(pitch / 4, amplitude / 2, pitch / 2);
  const valleyRadius = peakRadius;

  return {
    cuffOdLeft,
    cuffOdRight,
    convSectionLength,
    pitch,
    peakRadius,
    valleyRadius,
    innerRadiusLeft,
    innerRadiusRight,
    outerRadiusPeak,
    innerRadiusValley,
  };
}

export function buildWallProfilePoints(
  primary: RubberBellowsPrimary,
  derived: RubberBellowsDerived,
): { x: number; y: number }[] {
  const {
    cuffLengthLeft,
    cuffLengthRight,
    convolutionCount,
    wallThickness,
  } = primary;
  const {
    innerRadiusLeft,
    innerRadiusRight,
    cuffOdLeft,
    cuffOdRight,
    convSectionLength,
    pitch,
    peakRadius,
    outerRadiusPeak,
    innerRadiusValley,
  } = derived;

  const outerLeft = cuffOdLeft / 2;
  const outerRight = cuffOdRight / 2;
  const convStart = cuffLengthLeft;
  const convEnd = cuffLengthLeft + convSectionLength;

  const pts: { x: number; y: number }[] = [];

  pts.push({ x: 0, y: innerRadiusLeft });
  pts.push({ x: convStart, y: innerRadiusLeft });

  let x = convStart;
  const midInner = (innerRadiusLeft + innerRadiusRight) / 2;
  for (let i = 0; i < convolutionCount; i++) {
    const valleyX = x + pitch / 2;
    const peakX = x + pitch;
    const innerAtValley = innerRadiusValley;
    const innerAtPeak =
      midInner + (innerRadiusValley - midInner) * 0.15;
    pts.push({ x: valleyX, y: innerAtValley });
    if (i < convolutionCount - 1 || pitch > 0) {
      pts.push({ x: peakX, y: innerAtPeak });
    }
    x += pitch;
  }

  pts.push({ x: convEnd, y: innerRadiusRight });
  pts.push({ x: primary.totalLength, y: innerRadiusRight });

  pts.push({ x: primary.totalLength, y: outerRight });
  pts.push({ x: convEnd, y: outerRight });

  x = convEnd;
  for (let i = convolutionCount - 1; i >= 0; i--) {
    const peakX = convStart + (i + 1) * pitch;
    const valleyX = convStart + (i + 0.5) * pitch;
    const outerAtPeak = outerRadiusPeak;
    const outerAtValley = outerRadiusPeak - wallThickness * 0.5;
    pts.push({ x: peakX, y: outerAtPeak });
    pts.push({ x: valleyX, y: outerAtValley });
  }

  pts.push({ x: convStart, y: outerLeft });
  pts.push({ x: 0, y: outerLeft });
  pts.push({ x: 0, y: innerRadiusLeft });

  void peakRadius;
  return pts;
}

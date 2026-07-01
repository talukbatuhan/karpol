import type { DesignModule, ValidationIssue } from "../../core/types";
import {
  computeRubberBellowsDerived,
} from "./compute";
import {
  buildRubberBellowsProfiles,
  buildRubberBellowsSolidSpec,
} from "./profiles";
import {
  rubberBellowsDefaults,
  rubberBellowsSchema,
  type RubberBellowsDerived,
  type RubberBellowsPrimary,
} from "./schema";

export const rubberBellowsModule: DesignModule<
  RubberBellowsPrimary,
  RubberBellowsDerived
> = {
  id: "rubber-bellows",
  status: "active",
  schema: rubberBellowsSchema,
  computeDerived: computeRubberBellowsDerived,
  validate(primary, derived) {
    const issues: ValidationIssue[] = [];
    if (derived.convSectionLength <= 0) {
      issues.push({
        paramId: "totalLength",
        code: "conv_section_negative",
        messageKey: "errors.convSectionNegative",
      });
    }
    if (primary.convOdMax <= primary.convIdMin) {
      issues.push({
        paramId: "convOdMax",
        code: "conv_od_min",
        messageKey: "errors.convOdMin",
      });
    }
    if (primary.convolutionCount < 1) {
      issues.push({
        paramId: "convolutionCount",
        code: "conv_count",
        messageKey: "errors.convCount",
      });
    }
    if (derived.pitch <= 0) {
      issues.push({
        paramId: "convolutionCount",
        code: "pitch_zero",
        messageKey: "errors.pitchZero",
      });
    }
    return issues;
  },
  buildProfiles: buildRubberBellowsProfiles,
  buildSolidSpec: buildRubberBellowsSolidSpec,
  getDerivedParamDefs(derived) {
    return [
      { id: "convSectionLength", value: derived.convSectionLength },
      { id: "pitch", value: derived.pitch },
      { id: "peakRadius", value: derived.peakRadius },
      { id: "cuffOdLeft", value: derived.cuffOdLeft },
      { id: "cuffOdRight", value: derived.cuffOdRight },
    ];
  },
};

export { rubberBellowsDefaults };

import type { ParameterSchema } from "../../core/types";

export type RubberBellowsPrimary = {
  cuffIdLeft: number;
  cuffIdRight: number;
  cuffLengthLeft: number;
  cuffLengthRight: number;
  totalLength: number;
  convOdMax: number;
  convIdMin: number;
  wallThickness: number;
  convolutionCount: number;
};

export type RubberBellowsDerived = {
  cuffOdLeft: number;
  cuffOdRight: number;
  convSectionLength: number;
  pitch: number;
  peakRadius: number;
  valleyRadius: number;
  innerRadiusLeft: number;
  innerRadiusRight: number;
  outerRadiusPeak: number;
  innerRadiusValley: number;
};

export const rubberBellowsDefaults: RubberBellowsPrimary = {
  cuffIdLeft: 25,
  cuffIdRight: 25,
  cuffLengthLeft: 15,
  cuffLengthRight: 15,
  totalLength: 120,
  convOdMax: 45,
  convIdMin: 22,
  wallThickness: 2,
  convolutionCount: 6,
};

export const rubberBellowsSchema: ParameterSchema<RubberBellowsPrimary> = {
  moduleId: "rubber-bellows",
  defaults: rubberBellowsDefaults,
  parameters: [
    {
      id: "cuffIdLeft",
      labelKey: "cuffIdLeft",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 5,
      max: 500,
      step: 0.5,
      defaultValue: 25,
      group: "cuffs",
    },
    {
      id: "cuffIdRight",
      labelKey: "cuffIdRight",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 5,
      max: 500,
      step: 0.5,
      defaultValue: 25,
      group: "cuffs",
    },
    {
      id: "cuffLengthLeft",
      labelKey: "cuffLengthLeft",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 1,
      max: 500,
      step: 0.5,
      defaultValue: 15,
      group: "cuffs",
    },
    {
      id: "cuffLengthRight",
      labelKey: "cuffLengthRight",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 1,
      max: 500,
      step: 0.5,
      defaultValue: 15,
      group: "cuffs",
    },
    {
      id: "totalLength",
      labelKey: "totalLength",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 10,
      max: 2000,
      step: 1,
      defaultValue: 120,
      group: "overall",
    },
    {
      id: "convOdMax",
      labelKey: "convOdMax",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 10,
      max: 800,
      step: 0.5,
      defaultValue: 45,
      group: "convolutions",
    },
    {
      id: "convIdMin",
      labelKey: "convIdMin",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 5,
      max: 700,
      step: 0.5,
      defaultValue: 22,
      group: "convolutions",
    },
    {
      id: "wallThickness",
      labelKey: "wallThickness",
      role: "primary",
      type: "number",
      unit: "mm",
      min: 0.5,
      max: 20,
      step: 0.1,
      defaultValue: 2,
      group: "convolutions",
    },
    {
      id: "convolutionCount",
      labelKey: "convolutionCount",
      role: "primary",
      type: "integer",
      unit: "",
      min: 1,
      max: 40,
      step: 1,
      defaultValue: 6,
      group: "convolutions",
    },
  ],
};

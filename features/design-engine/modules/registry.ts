import type { DesignModule } from "../core/types";
import { grindingRubberModule } from "./grinding-rubber";
import { rubberBellowsModule } from "./rubber-bellows";
import { vibrationDamperModule } from "./vibration-damper";

export type ModuleId =
  | "rubber-bellows"
  | "grinding-rubber"
  | "vibration-damper"
  | "o-ring"
  | "rubber-profile"
  | "extrusion"
  | "seal"
  | "roller"
  | "conveyor-component"
  | "mold-design";

const stub = (id: ModuleId): DesignModule => ({
  id,
  status: "planned",
  schema: {
    moduleId: id,
    defaults: {},
    parameters: [],
  },
  computeDerived: () => ({}),
  validate: () => [],
  buildProfiles: () => [],
  buildSolidSpec: () => null,
  getDerivedParamDefs: () => [],
});

export const designModules: Record<string, DesignModule> = {
  "rubber-bellows": rubberBellowsModule,
  "grinding-rubber": grindingRubberModule,
  "vibration-damper": vibrationDamperModule,
  "o-ring": stub("o-ring"),
  "rubber-profile": stub("rubber-profile"),
  extrusion: stub("extrusion"),
  seal: stub("seal"),
  roller: stub("roller"),
  "conveyor-component": stub("conveyor-component"),
  "mold-design": stub("mold-design"),
};

export function getDesignModule(id: string): DesignModule | undefined {
  return designModules[id];
}

export const activeModuleIds = Object.entries(designModules)
  .filter(([, m]) => m.status === "active")
  .map(([id]) => id);

export {
  rubberBellowsModule,
  grindingRubberModule,
  vibrationDamperModule,
};

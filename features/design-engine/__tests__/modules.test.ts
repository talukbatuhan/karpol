import { describe, expect, it } from "vitest";
import { evaluateDesign } from "../core/evaluate";
import { rubberBellowsModule } from "../modules/rubber-bellows";
import { rubberBellowsDefaults } from "../modules/rubber-bellows/schema";
import { grindingRubberModule } from "../modules/grinding-rubber";
import { grindingRubberDefaults } from "../modules/grinding-rubber/schema";

describe("rubber-bellows", () => {
  it("computes derived pitch from primary inputs", () => {
    const derived = rubberBellowsModule.computeDerived(rubberBellowsDefaults);
    expect(derived.convSectionLength).toBe(90);
    expect(derived.pitch).toBe(15);
  });

  it("evaluates valid model with profiles and solid spec", () => {
    const model = evaluateDesign(rubberBellowsModule, rubberBellowsDefaults);
    expect(model.valid).toBe(true);
    expect(model.views.length).toBeGreaterThan(0);
    expect(model.solidSpec?.kind).toBe("revolve");
  });

  it("rejects invalid convolution OD", () => {
    const model = evaluateDesign(rubberBellowsModule, {
      ...rubberBellowsDefaults,
      convOdMax: 10,
    });
    expect(model.valid).toBe(false);
    expect(model.issues.length).toBeGreaterThan(0);
  });
});

describe("grinding-rubber", () => {
  it("validates diameter constraints", () => {
    const model = evaluateDesign(grindingRubberModule, {
      ...grindingRubberDefaults,
      icCap: 250,
    });
    expect(model.valid).toBe(false);
  });

  it("builds cylinder solid with holes", () => {
    const model = evaluateDesign(grindingRubberModule, grindingRubberDefaults);
    expect(model.valid).toBe(true);
    expect(model.solidSpec?.kind).toBe("cylinder");
  });
});

import { describe, expect, it } from "vitest";
import { getDelayMs } from "./tutor";

describe("tutor", () => {
  it("keeps hint escalation calm for children", () => {
    expect(getDelayMs(0)).toBeGreaterThanOrEqual(6500);
    expect(getDelayMs(10)).toBeGreaterThanOrEqual(4200);
  });
});

import { describe, expect, it } from "vitest";
import { addItem, placeItem, removePlacedItem } from "./inventory";
import { createDefaultProfile } from "./profile";
import type { Profile } from "./types";

describe("inventory", () => {
  it("stacks duplicate decor items immutably", () => {
    const initial = createDefaultProfile();
    let profile: Profile = addItem(initial, "yarn-ball");
    profile = addItem(profile, "yarn-ball");

    expect(profile).not.toBe(initial);
    expect(initial.inventory).toEqual([]);
    expect(profile.inventory).toEqual([{ itemId: "yarn-ball", count: 2, isNew: true, favorite: false }]);
  });

  it("moves one stacked item into the room and back", () => {
    let profile = addItem(createDefaultProfile(), "cat-pillow");
    profile = addItem(profile, "cat-pillow");
    profile = placeItem(profile, "cat-pillow", { x: 20, y: 70 }, "placed-1");

    expect(profile.inventory.find((item) => item.itemId === "cat-pillow")?.count).toBe(1);
    expect(profile.placedItems).toEqual([{ instanceId: "placed-1", itemId: "cat-pillow", x: 20, y: 70 }]);

    profile = removePlacedItem(profile, "placed-1");

    expect(profile.inventory.find((item) => item.itemId === "cat-pillow")?.count).toBe(2);
    expect(profile.placedItems).toEqual([]);
  });
});

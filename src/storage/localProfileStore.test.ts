import { beforeEach, describe, expect, it } from "vitest";
import { addItem } from "../domain/inventory";
import { createDefaultProfile } from "../domain/profile";
import { loadProfile, PROFILE_STORAGE_KEY, saveProfile } from "./localProfileStore";

describe("localProfileStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads a default profile when storage is empty or invalid", () => {
    expect(loadProfile()).toEqual(createDefaultProfile());

    localStorage.setItem(PROFILE_STORAGE_KEY, "{not json");
    expect(loadProfile()).toEqual(createDefaultProfile());
  });

  it("saves and loads a profile with the v1 key", () => {
    const profile = addItem(createDefaultProfile("en"), "sunny-rug");

    saveProfile(profile);

    expect(localStorage.getItem("keycat.profile.v1")).not.toBeNull();
    expect(loadProfile()).toEqual(profile);
  });
});

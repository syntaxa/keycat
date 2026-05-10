import { createDefaultProfile } from "../domain/profile";
import type { Profile } from "../domain/types";

export const PROFILE_STORAGE_KEY = "keycat.profile.v1";

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<Profile>;
  return (
    (profile.selectedLayout === "ru" || profile.selectedLayout === "en") &&
    typeof profile.level === "number" &&
    typeof profile.xp === "number" &&
    typeof profile.eggProgress === "number" &&
    !!profile.layoutProgress &&
    Array.isArray(profile.inventory) &&
    Array.isArray(profile.placedItems)
  );
}

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return createDefaultProfile();

    const parsed = JSON.parse(raw) as unknown;
    return isProfile(parsed) ? parsed : createDefaultProfile();
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

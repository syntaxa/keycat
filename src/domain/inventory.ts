import type { InventoryStack, PlacedItem, Profile } from "./types";

export function addItem(profile: Profile, itemId: string, count = 1): Profile {
  const existing = profile.inventory.find((item) => item.itemId === itemId);
  const inventory = existing
    ? profile.inventory.map((item) => (item.itemId === itemId ? { ...item, count: item.count + count, isNew: true } : item))
    : [...profile.inventory, { itemId, count, isNew: true, favorite: false }];

  return { ...profile, inventory };
}

export function placeItem(profile: Profile, itemId: string, position: Pick<PlacedItem, "x" | "y">, instanceId: string): Profile {
  const stack = profile.inventory.find((item) => item.itemId === itemId);
  if (!stack || stack.count <= 0) return profile;

  const inventory = stack.count === 1
    ? profile.inventory.filter((item) => item.itemId !== itemId)
    : profile.inventory.map((item) => (item.itemId === itemId ? { ...item, count: item.count - 1 } : item));

  return {
    ...profile,
    inventory,
    placedItems: [...profile.placedItems, { instanceId, itemId, x: position.x, y: position.y }]
  };
}

export function removePlacedItem(profile: Profile, instanceId: string): Profile {
  const placed = profile.placedItems.find((item) => item.instanceId === instanceId);
  if (!placed) return profile;

  return {
    ...addItem(profile, placed.itemId),
    placedItems: profile.placedItems.filter((item) => item.instanceId !== instanceId)
  };
}

export function addInventoryItem(items: InventoryStack[], itemId: string): InventoryStack[] {
  const existing = items.find((item) => item.itemId === itemId);
  if (existing) {
    return items.map((item) => (item.itemId === itemId ? { ...item, count: item.count + 1, isNew: true } : item));
  }
  return [...items, { itemId, count: 1, isNew: true, favorite: false }];
}

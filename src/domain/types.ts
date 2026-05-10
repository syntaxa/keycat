export type LayoutId = "ru" | "en";
export type KeyboardRow = "top" | "home" | "bottom";
export type KeyboardQuarter = "left" | "centerLeft" | "centerRight" | "right";
export type HintStage = "none" | "quarter" | "row" | "key";
export type CatMood = "idle" | "happy" | "mistake";
export type ItemCategory =
  | "beds"
  | "toys"
  | "furniture"
  | "textiles"
  | "care"
  | "plants"
  | "decorations"
  | "special";

export interface KeyDefinition {
  letter: string;
  display: string;
  code: string;
  row: KeyboardRow;
  quarter: KeyboardQuarter;
  unlockOrder: number;
}

export interface KeyboardLayout {
  id: LayoutId;
  label: string;
  keys: KeyDefinition[];
}

export interface LetterProgress {
  attempts: number;
  correct: number;
  totalResponseMs: number;
  mastered: boolean;
}

export interface LayoutProgress {
  unlockedLetters: string[];
  letters: Record<string, LetterProgress>;
}

export interface InventoryStack {
  itemId: string;
  count: number;
  isNew: boolean;
  favorite: boolean;
}

export interface PlacedItem {
  instanceId: string;
  itemId: string;
  x: number;
  y: number;
}

export interface Profile {
  selectedLayout: LayoutId;
  level: number;
  xp: number;
  eggProgress: number;
  layoutProgress: Record<LayoutId, LayoutProgress>;
  inventory: InventoryStack[];
  placedItems: PlacedItem[];
}

export interface SessionState {
  target: string;
  hintStage: HintStage;
  mistakes: number;
  correct: number;
  finished: boolean;
}

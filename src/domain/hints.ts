import type { HintStage, KeyboardQuarter, KeyboardRow, KeyDefinition } from "./types";

export type ActiveHint =
  | { stage: "none" }
  | { stage: "quarter"; quarter: KeyboardQuarter }
  | { stage: "row"; row: KeyboardRow }
  | { stage: "key"; code: string };

export function getHintForStage(key: KeyDefinition, stage: HintStage): ActiveHint;
export function getHintForStage(stage: HintStage, key: KeyDefinition): string;
export function getHintForStage(first: KeyDefinition | HintStage, second: HintStage | KeyDefinition): ActiveHint | string {
  if (typeof first === "string") {
    const stage = first;
    const key = second as KeyDefinition;
    if (stage === "quarter") return `Четверть: ${key.quarter}`;
    if (stage === "row") return `Ряд: ${key.row}`;
    if (stage === "key") return `Клавиша: ${key.display}`;
    return "";
  }

  const key = first;
  const stage = second as HintStage;
  if (stage === "quarter") return { stage, quarter: key.quarter };
  if (stage === "row") return { stage, row: key.row };
  if (stage === "key") return { stage, code: key.code };
  return { stage: "none" };
}

export function nextHintAfterDelay(stage: HintStage): HintStage {
  if (stage === "none") return "quarter";
  if (stage === "quarter") return "row";
  return "key";
}

export function nextHintAfterMistake(stage: HintStage): HintStage {
  if (stage === "none") return "row";
  return "key";
}

export function softenHintAfterSuccess(stage: HintStage): HintStage {
  if (stage === "key") return "row";
  if (stage === "row") return "quarter";
  return "none";
}

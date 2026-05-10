import type { HintStage, KeyDefinition } from "./types";
export const getHintForStage=(stage:HintStage,key:KeyDefinition)=> stage==="quarter"?`Четверть: ${key.quarter}`:stage==="row"?`Ряд: ${key.row}`:stage==="key"?`Клавиша: ${key.display}`:"";
export const nextHintAfterDelay=(stage:HintStage):HintStage=> stage==="none"?"quarter":stage==="quarter"?"row":stage==="row"?"key":"key";
export const nextHintAfterMistake=nextHintAfterDelay;

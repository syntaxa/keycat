import { keyboardLayouts } from "./keyboardLayouts";
import type { LayoutId } from "./types";
export const pickNextLetter=(layout:LayoutId)=> keyboardLayouts[layout].keys[Math.floor(Math.random()*keyboardLayouts[layout].keys.length)].letter;

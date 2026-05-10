import type { SessionState } from "./types";
import { nextHintAfterMistake } from "./hints";
export const createSession=(target:string):SessionState=>({target,hintStage:"none",mistakes:0,correct:0,finished:false});
export const handleInput=(s:SessionState,input:string):SessionState=> input===s.target?{...s,correct:s.correct+1,finished:true}:{...s,mistakes:s.mistakes+1,hintStage:nextHintAfterMistake(s.hintStage)};

import { useEffect, useMemo, useState } from "react";
import { keyboardLayouts } from "../domain/keyboardLayouts";
import { createSession, handleInput } from "../domain/session";
import type { LayoutId } from "../domain/types";
import { getHintForStage } from "../domain/hints";
import { RoomScene } from "./RoomScene";
import { MiniKeyboard } from "./MiniKeyboard";
export function GameScreen({layout,onFinish}:{layout:LayoutId;onFinish:(correct:number)=>void}){const target=useMemo(()=>keyboardLayouts[layout].keys[0], [layout]);const [session,setSession]=useState(()=>createSession(target.letter));useEffect(()=>{setSession(createSession(target.letter));},[target.letter]);useEffect(()=>{const fn=(e:KeyboardEvent)=>{const next=handleInput(session,e.key.toLowerCase());setSession(next);if(next.finished) onFinish(next.correct);};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[session,onFinish]);return <div><RoomScene target={session.target} mistake={session.mistakes>0}/><MiniKeyboard hint={getHintForStage(session.hintStage,target)}/></div>;}

import { nextHintAfterDelay, nextHintAfterMistake, softenHintAfterSuccess } from "./hints";
import { chooseNextKey, getDelayMs } from "./tutor";
import type { CatMood, HintStage, KeyboardLayout, KeyDefinition, LetterResponse, Profile, SessionState } from "./types";

export interface GameSession {
  [key: string]: unknown;
  profile: Profile;
  layout: KeyboardLayout;
  startedAt: number;
  step: number;
  currentKey: KeyDefinition;
  hintStage: HintStage;
  catMood: CatMood;
  correctCount: number;
  mistakeCount: number;
  delayMs: number;
  lastEvent?: "success" | "mistake" | null;
  responses: LetterResponse[];
}

export function createSession(target: string): SessionState;
export function createSession(profile: Profile, layout: KeyboardLayout, now: number): GameSession;
export function createSession(first: string | Profile, layout?: KeyboardLayout, now = Date.now()): SessionState | GameSession {
  if (typeof first === "string") {
    return { target: first, hintStage: "none", mistakes: 0, correct: 0, finished: false };
  }

  const profile = first;
  const currentKey = chooseNextKey(profile, layout!, 0);
  return {
    profile,
    layout: layout!,
    startedAt: now,
    step: 0,
    currentKey,
    hintStage: "none",
    catMood: "idle",
    correctCount: 0,
    mistakeCount: 0,
    delayMs: getDelayMs(0),
    lastEvent: null,
    responses: []
  };
}

export function handleInput(session: SessionState, input: string): SessionState {
  const normalized = input.toLowerCase();
  if (normalized === session.target) {
    return { ...session, correct: session.correct + 1, finished: true };
  }
  return { ...session, mistakes: session.mistakes + 1, hintStage: nextHintAfterMistake(session.hintStage) };
}

export function handleKeyPress(session: GameSession, code: string, responseMs: number): GameSession {
  const isCorrect = code === session.currentKey.code;
  const responses = [...session.responses, { letter: session.currentKey.letter, code, correct: isCorrect, responseMs }];

  if (!isCorrect) {
    return {
      ...session,
      hintStage: nextHintAfterMistake(session.hintStage),
      catMood: "mistake",
      mistakeCount: session.mistakeCount + 1,
      lastEvent: "mistake",
      responses
    };
  }

  const correctCount = session.correctCount + 1;
  const step = session.step + 1;
  return {
    ...session,
    step,
    currentKey: correctCount >= 10 ? session.currentKey : chooseNextKey(session.profile, session.layout, step),
    hintStage: softenHintAfterSuccess(session.hintStage),
    catMood: "happy",
    correctCount,
    delayMs: getDelayMs(step),
    lastEvent: "success",
    responses
  };
}

export function handleDelay(session: GameSession): GameSession {
  return {
    ...session,
    hintStage: nextHintAfterDelay(session.hintStage),
    catMood: "idle",
    lastEvent: null
  };
}

export function isSessionComplete(session: GameSession): boolean {
  return session.correctCount >= 10;
}

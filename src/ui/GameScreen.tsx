import { useEffect, useRef } from "react";
import { handleDelay, handleKeyPress, isSessionComplete, type GameSession } from "../domain/session";
import { MiniKeyboard } from "./MiniKeyboard";
import { RoomScene } from "./RoomScene";

export type { GameSession } from "../domain/session";

interface GameScreenProps {
  session: GameSession;
  onSessionChange: (session: GameSession) => void;
  onFinish: (session: GameSession) => void;
}

export function GameScreen({ session, onSessionChange, onFinish }: GameScreenProps) {
  const shownAt = useRef(performance.now());

  useEffect(() => {
    shownAt.current = performance.now();
    const delayTimer = window.setTimeout(() => {
      onSessionChange(handleDelay(session));
    }, session.delayMs);
    return () => window.clearTimeout(delayTimer);
  }, [session, session.currentKey.code, session.delayMs, onSessionChange]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const responseMs = performance.now() - shownAt.current;
      const next = handleKeyPress(session, event.code, responseMs);
      if (isSessionComplete(next)) {
        onFinish(next);
      } else {
        onSessionChange(next);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [session, onSessionChange, onFinish]);

  return (
    <section className="game-screen">
      <RoomScene currentKey={session.currentKey} catMood={session.catMood} />
      <MiniKeyboard layout={session.layout} currentLetter={session.currentKey.letter} hintStage={session.hintStage} />
      <div className="session-stats" aria-label="Статистика урока">
        <span>Верно: {session.correctCount}/10</span>
        <span>Ошибки: {session.mistakeCount}</span>
      </div>
    </section>
  );
}

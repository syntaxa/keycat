import type { KeyDefinition } from "../domain/types";

type CatMood = "idle" | "happy" | "mistake";

interface RoomSceneProps {
  currentKey: KeyDefinition;
  catMood: CatMood;
}

export function RoomScene({ currentKey, catMood }: RoomSceneProps) {
  const mistake = catMood === "mistake";

  return (
    <section className="room-scene" aria-label="Комната котика">
      <div className="room-wall">
        <div className="window" aria-hidden="true">
          ☀
        </div>
        <div className="shelf" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="letter-object" aria-label={`Буква ${currentKey.display}`}>
        <span>{currentKey.display}</span>
      </div>
      <div className={`cat cat-${catMood}`} aria-label={mistake ? "Котик ошибся" : "Котик"}>
        <div className="cat-ear cat-ear-left" />
        <div className="cat-ear cat-ear-right" />
        <div className="cat-face">
          <span className="eye" />
          <span className="eye" />
          {mistake && <span className="tear" aria-label="Слезинка" />}
          <span className="mouth">{catMood === "happy" ? "ᴗ" : "⌣"}</span>
        </div>
      </div>
    </section>
  );
}

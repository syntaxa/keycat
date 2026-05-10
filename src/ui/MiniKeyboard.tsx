import type { HintStage, KeyboardLayout } from "../domain/types";

interface MiniKeyboardProps {
  layout: KeyboardLayout;
  currentLetter: string;
  hintStage: HintStage;
}

const rows = ["top", "home", "bottom"] as const;

export function MiniKeyboard({ layout, currentLetter, hintStage }: MiniKeyboardProps) {
  const currentKey = layout.keys.find((key) => key.letter === currentLetter) ?? layout.keys[0];

  return (
    <section className="mini-keyboard" aria-label="Подсказка клавиатуры">
      {rows.map((row) => (
        <div className="keyboard-row" key={row}>
          {layout.keys
            .filter((key) => key.row === row)
            .map((key) => {
              const highlighted =
                (hintStage === "quarter" && key.quarter === currentKey.quarter) ||
                (hintStage === "row" && key.row === currentKey.row && key.quarter === currentKey.quarter) ||
                (hintStage === "key" && key.code === currentKey.code);
              return (
                <span
                  className={highlighted ? "keycap highlighted" : "keycap"}
                  data-code={key.code}
                  key={key.code}
                >
                  {key.display}
                </span>
              );
            })}
        </div>
      ))}
    </section>
  );
}

import type { LayoutId } from "../domain/types";

interface LayoutSelectProps {
  selectedLayout: LayoutId;
  onSelect: (layout: LayoutId) => void;
}

function activeLabel(layout: LayoutId) {
  return layout === "ru" ? "Русская" : "Английская";
}

export function LayoutSelect({ selectedLayout, onSelect }: LayoutSelectProps) {
  return (
    <section className="panel layout-select" aria-labelledby="layout-title">
      <h2 id="layout-title">Выбор раскладки</h2>
      <p className="active-layout-badge">Активна: {activeLabel(selectedLayout)}</p>
      <div className="layout-buttons">
        <button
          type="button"
          className={selectedLayout === "ru" ? "selected" : ""}
          aria-label={selectedLayout === "ru" ? "Русская раскладка активна" : "Русская раскладка"}
          aria-pressed={selectedLayout === "ru"}
          onClick={() => onSelect("ru")}
        >
          Русская раскладка
        </button>
        <button
          type="button"
          className={selectedLayout === "en" ? "selected" : ""}
          aria-label={selectedLayout === "en" ? "Английская раскладка активна" : "Английская раскладка"}
          aria-pressed={selectedLayout === "en"}
          onClick={() => onSelect("en")}
        >
          Английская раскладка
        </button>
      </div>
    </section>
  );
}

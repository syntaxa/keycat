import type { KeyboardLayout, Profile } from "../domain/types";

interface ProgressPanelProps {
  profile: Profile;
  layout: KeyboardLayout;
}

function layoutLabel(layout: KeyboardLayout) {
  return layout.id === "ru" ? "Русская" : "Английская";
}

export function ProgressPanel({ profile, layout }: ProgressPanelProps) {
  return (
    <aside className="panel progress-panel" aria-label="Прогресс">
      <span>Уровень: {profile.level}</span>
      <span>XP: {profile.xp}</span>
      <span>Яйцо: {profile.eggProgress}/5</span>
      <span>Раскладка: {layoutLabel(layout)}</span>
    </aside>
  );
}

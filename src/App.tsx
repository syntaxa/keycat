import { useEffect, useMemo, useState } from "react";
import { keyboardLayouts } from "./domain/keyboardLayouts";
import { applySessionReward, pickDecorReward, type SessionReward } from "./domain/progression";
import { createSession, type GameSession } from "./domain/session";
import type { LayoutId, Profile } from "./domain/types";
import { loadProfile, saveProfile } from "./storage/localProfileStore";
import { GameScreen } from "./ui/GameScreen";
import { InventoryPanel } from "./ui/InventoryPanel";
import { LayoutSelect } from "./ui/LayoutSelect";
import { ProgressPanel } from "./ui/ProgressPanel";
import { RewardScreen } from "./ui/RewardScreen";

function createGameSession(profile: Profile) {
  return createSession(profile, keyboardLayouts[profile.selectedLayout], Date.now());
}

export function App() {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const layout = useMemo(() => keyboardLayouts[profile.selectedLayout], [profile.selectedLayout]);
  const [session, setSession] = useState<GameSession>(() => createGameSession(profile));
  const [lastReward, setLastReward] = useState<SessionReward | null>(null);

  useEffect(() => {
    document.title = "Сиамский кисыч";
  }, []);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  function selectLayout(selectedLayout: LayoutId) {
    const nextProfile = { ...profile, selectedLayout };
    setProfile(nextProfile);
    setLastReward(null);
    setSession(createGameSession(nextProfile));
  }

  function finishSession(doneSession: GameSession) {
    const reward = {
      xp: Math.max(25, 60 - doneSession.mistakeCount * 4),
      decorItemId: pickDecorReward(),
      eggProgress: 1
    };
    const nextProfile = applySessionReward(profile, reward);
    setProfile(nextProfile);
    setLastReward(reward);
  }

  function continueAfterReward() {
    setLastReward(null);
    setSession(createGameSession(profile));
  }

  return (
    <main className="app-shell">
      <header className="game-header">
        <h1>Сиамский кисыч</h1>
        <p>Нажимай буквы на клавиатуре и помогай котику обустроить дом.</p>
      </header>
      <div className="app-grid">
        <div className="main-column">
          <LayoutSelect selectedLayout={profile.selectedLayout} onSelect={selectLayout} />
          <ProgressPanel profile={profile} layout={layout} />
          {lastReward ? (
            <RewardScreen
              xp={lastReward.xp}
              decorItemId={lastReward.decorItemId}
              eggProgress={lastReward.eggProgress}
              onContinue={continueAfterReward}
            />
          ) : (
            <GameScreen session={session} onSessionChange={setSession} onFinish={finishSession} />
          )}
        </div>
        <InventoryPanel inventory={profile.inventory} />
      </div>
    </main>
  );
}

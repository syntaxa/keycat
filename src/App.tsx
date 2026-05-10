import { useState } from "react";
import { createDefaultProfile } from "./domain/profile";
import { applySessionXp } from "./domain/progression";
import { LayoutSelect } from "./ui/LayoutSelect";
import { GameScreen } from "./ui/GameScreen";
import { ProgressPanel } from "./ui/ProgressPanel";
import { RewardScreen } from "./ui/RewardScreen";
const profile0=createDefaultProfile();
export function App(){const [layout,setLayout]=useState(profile0.selectedLayout);const [xp,setXp]=useState(0);const [level,setLevel]=useState(1);const [reward,setReward]=useState<number|null>(null);return <main className="app-shell"><section className="hero-panel"><h1>КлавоКот</h1><LayoutSelect value={layout} onChange={setLayout}/><ProgressPanel level={level} xp={xp}/>{reward===null?<GameScreen layout={layout} onFinish={(correct)=>{const res=applySessionXp(xp,correct);setXp(res.xp);setLevel(res.level);setReward(res.gained);}}/>:<RewardScreen xp={reward}/>}</section></main>;}
